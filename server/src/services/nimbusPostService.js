const axios = require('axios');
const logger = require('../utils/logger');

class NimbusPostService {
  constructor() {
    this.baseURL = process.env.NIMBUS_POST_BASE_URL || 'https://api.nimbuspost.com/v1';
    this.apiKey = process.env.NIMBUS_POST_API_KEY;
    this.username = process.env.NIMBUS_POST_USERNAME;
    this.password = process.env.NIMBUS_POST_PASSWORD;
    this.warehouseId = process.env.NIMBUS_POST_WAREHOUSE_ID;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      timeout: 30000
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.info(`NimbusPost API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('NimbusPost API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        logger.info(`NimbusPost API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        logger.error('NimbusPost API Response Error:', {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url
        });
        return Promise.reject(error);
      }
    );
  }

  // Authenticate and get access token
  async authenticate() {
    try {
      const response = await this.client.post('/users/login', {
        username: this.username,
        password: this.password
      });

      if (response.data.status) {
        this.accessToken = response.data.data;
        this.client.defaults.headers['Authorization'] = `Bearer ${this.accessToken}`;
        logger.info('NimbusPost authentication successful');
        return this.accessToken;
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      logger.error('NimbusPost authentication error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with NimbusPost');
    }
  }

  // Get shipping rates
  async getShippingRates(orderData) {
    try {
      const payload = {
        origin: orderData.origin || this.warehouseId,
        destination: orderData.destination,
        payment_type: orderData.paymentType || 'prepaid',
        order_amount: orderData.orderAmount,
        weight: orderData.weight || 0.5,
        length: orderData.length || 10,
        breadth: orderData.breadth || 10,
        height: orderData.height || 10
      };

      const response = await this.client.post('/courier/serviceability', payload);
      
      if (response.data.status) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to get shipping rates');
      }
    } catch (error) {
      logger.error('NimbusPost shipping rates error:', error.response?.data || error.message);
      throw new Error('Failed to get shipping rates');
    }
  }

  // Create shipping order
  async createShippingOrder(orderData) {
    try {
      await this.authenticate(); // Ensure we have valid token

      const payload = {
        order_number: orderData.orderNumber,
        shipping_charges: orderData.shippingCharges || 0,
        discount: orderData.discount || 0,
        cod_charges: orderData.codCharges || 0,
        payment_type: orderData.paymentType || 'prepaid',
        order_amount: orderData.orderAmount,
        package_weight: orderData.weight || 0.5,
        package_length: orderData.length || 10,
        package_breadth: orderData.breadth || 10,
        package_height: orderData.height || 10,
        request_auto_pickup: 'yes',
        consignee: {
          name: orderData.consignee.name,
          address: orderData.consignee.address,
          address_2: orderData.consignee.address2 || '',
          city: orderData.consignee.city,
          state: orderData.consignee.state,
          pincode: orderData.consignee.pincode,
          phone: orderData.consignee.phone,
          email: orderData.consignee.email || ''
        },
        pickup: {
          warehouse_name: orderData.pickup?.warehouseName || 'Main Warehouse',
          name: orderData.pickup?.name || 'VCX MART',
          address: orderData.pickup?.address || 'Warehouse Address',
          address_2: orderData.pickup?.address2 || '',
          city: orderData.pickup?.city || 'Mumbai',
          state: orderData.pickup?.state || 'Maharashtra',
          pincode: orderData.pickup?.pincode || '400001',
          phone: orderData.pickup?.phone || '9999999999',
          email: orderData.pickup?.email || 'warehouse@vcxmart.com'
        },
        order_items: orderData.items.map(item => ({
          name: item.name,
          qty: item.quantity,
          price: item.price,
          sku: item.sku || item.productId
        })),
        courier_partner: orderData.courierPartner || 'auto',
        fragile_items: orderData.fragileItems || false,
        dangerous_goods: orderData.dangerousGoods || false
      };

      const response = await this.client.post('/shipments', payload);
      
      if (response.data.status) {
        const shipmentData = response.data.data;
        return {
          success: true,
          nimbusOrderId: shipmentData.shipment_id,
          trackingNumber: shipmentData.awb,
          courierPartner: shipmentData.courier_name,
          estimatedDelivery: shipmentData.expected_delivery_date,
          trackingUrl: `https://track.nimbuspost.com/${shipmentData.awb}`,
          pickupScheduled: shipmentData.pickup_scheduled_date,
          shippingLabel: shipmentData.label_url,
          manifest: shipmentData.manifest_url
        };
      } else {
        throw new Error(response.data.message || 'Failed to create shipping order');
      }
    } catch (error) {
      logger.error('NimbusPost create order error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create shipping order'
      };
    }
  }

  // Track shipment
  async trackShipment(trackingNumber) {
    try {
      const response = await this.client.get(`/shipments/track/${trackingNumber}`);
      
      if (response.data.status) {
        const trackingData = response.data.data;
        return {
          success: true,
          trackingNumber: trackingData.awb,
          status: trackingData.current_status,
          statusCode: trackingData.current_status_code,
          location: trackingData.current_location,
          estimatedDelivery: trackingData.expected_delivery_date,
          actualDelivery: trackingData.delivered_date,
          trackingHistory: trackingData.tracking_data || [],
          courierPartner: trackingData.courier_name
        };
      } else {
        throw new Error(response.data.message || 'Failed to track shipment');
      }
    } catch (error) {
      logger.error('NimbusPost tracking error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to track shipment'
      };
    }
  }

  // Cancel shipment
  async cancelShipment(nimbusOrderId, reason = 'Customer request') {
    try {
      const response = await this.client.post(`/shipments/${nimbusOrderId}/cancel`, {
        reason: reason
      });
      
      if (response.data.status) {
        return {
          success: true,
          message: 'Shipment cancelled successfully',
          refundAmount: response.data.data.refund_amount || 0
        };
      } else {
        throw new Error(response.data.message || 'Failed to cancel shipment');
      }
    } catch (error) {
      logger.error('NimbusPost cancel shipment error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to cancel shipment'
      };
    }
  }

  // Schedule pickup
  async schedulePickup(pickupData) {
    try {
      const payload = {
        shipment_ids: pickupData.shipmentIds,
        pickup_date: pickupData.pickupDate,
        pickup_time: pickupData.pickupTime || '10:00-18:00',
        pickup_location: {
          name: pickupData.location.name,
          address: pickupData.location.address,
          city: pickupData.location.city,
          state: pickupData.location.state,
          pincode: pickupData.location.pincode,
          phone: pickupData.location.phone
        }
      };

      const response = await this.client.post('/pickups/schedule', payload);
      
      if (response.data.status) {
        return {
          success: true,
          pickupId: response.data.data.pickup_id,
          scheduledDate: response.data.data.pickup_date,
          scheduledTime: response.data.data.pickup_time
        };
      } else {
        throw new Error(response.data.message || 'Failed to schedule pickup');
      }
    } catch (error) {
      logger.error('NimbusPost schedule pickup error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to schedule pickup'
      };
    }
  }

  // Get pickup status
  async getPickupStatus(pickupId) {
    try {
      const response = await this.client.get(`/pickups/${pickupId}`);
      
      if (response.data.status) {
        return {
          success: true,
          status: response.data.data.status,
          scheduledDate: response.data.data.pickup_date,
          actualPickupDate: response.data.data.actual_pickup_date,
          shipments: response.data.data.shipments
        };
      } else {
        throw new Error(response.data.message || 'Failed to get pickup status');
      }
    } catch (error) {
      logger.error('NimbusPost pickup status error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get pickup status'
      };
    }
  }

  // Get shipping label
  async getShippingLabel(nimbusOrderId) {
    try {
      const response = await this.client.get(`/shipments/${nimbusOrderId}/label`);
      
      if (response.data.status) {
        return {
          success: true,
          labelUrl: response.data.data.label_url,
          labelFormat: response.data.data.format || 'PDF'
        };
      } else {
        throw new Error(response.data.message || 'Failed to get shipping label');
      }
    } catch (error) {
      logger.error('NimbusPost shipping label error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get shipping label'
      };
    }
  }

  // Get manifest
  async getManifest(pickupId) {
    try {
      const response = await this.client.get(`/pickups/${pickupId}/manifest`);
      
      if (response.data.status) {
        return {
          success: true,
          manifestUrl: response.data.data.manifest_url,
          manifestFormat: response.data.data.format || 'PDF'
        };
      } else {
        throw new Error(response.data.message || 'Failed to get manifest');
      }
    } catch (error) {
      logger.error('NimbusPost manifest error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get manifest'
      };
    }
  }

  // Webhook handler for status updates
  handleWebhook(webhookData) {
    try {
      const {
        awb,
        current_status,
        current_status_code,
        current_location,
        delivered_date,
        expected_delivery_date,
        courier_name
      } = webhookData;

      return {
        trackingNumber: awb,
        status: current_status,
        statusCode: current_status_code,
        location: current_location,
        deliveredDate: delivered_date,
        estimatedDelivery: expected_delivery_date,
        courierPartner: courier_name,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('NimbusPost webhook processing error:', error);
      throw new Error('Failed to process webhook data');
    }
  }
}

module.exports = new NimbusPostService();