import Company from '../models/Company.js';

export const getPaymentInfo = async (req, res) => {
  try {
    console.log('getPaymentInfo - Request received');
    console.log('getPaymentInfo - User ID:', req.user.id);
    console.log('getPaymentInfo - User type:', req.user.type);
    
    // Get the first company (or modify as needed)
    const company = await Company.findOne({}).select('paymentGateway paymentQR');
    
    if (!company) {
      console.log('getPaymentInfo - No company found');
      return res.status(404).json({ 
        success: false,
        message: 'Company not found' 
      });
    }

    console.log('getPaymentInfo - Company found, returning payment info');
    res.json({
      success: true,
      paymentGateway: company.paymentGateway,
      paymentQR: company.paymentQR
    });
  } catch (error) {
    console.error('Error in getPaymentInfo:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};
