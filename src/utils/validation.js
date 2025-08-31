class ValidationUtil {
  /**
   * ตรวจสอบเบอร์มือถือไทย
   * ต้องขึ้นต้นด้วย 0 และมี 10 หลัก
   * @param {string} phoneNumber - เบอร์มือถือที่ต้องการตรวจสอบ
   * @returns {boolean} - true ถ้าถูกต้อง, false ถ้าไม่ถูกต้อง
   */
  static validateThaiPhoneNumber(phoneNumber) {
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return false;
    }
    
    // ลบช่องว่างและเครื่องหมายขีด
    const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // ตรวจสอบว่าเริ่มต้นด้วย 0 และมี 10 หลัก
    const phoneRegex = /^0[689]\d{8}$/;
    
    return phoneRegex.test(cleanPhone);
  }

  /**
   * ตรวจสอบเลขบัตรประจำตัวประชาชนไทย
   * ต้องมี 13 หลัก และผ่านการตรวจสอบ checksum
   * @param {string} idNumber - เลขบัตรประจำตัวประชาชนที่ต้องการตรวจสอบ
   * @returns {boolean} - true ถ้าถูกต้อง, false ถ้าไม่ถูกต้อง
   */
  static validateThaiNationalID(idNumber) {
    if (!idNumber || typeof idNumber !== 'string') {
      return false;
    }
    
    // ลบช่องว่างและเครื่องหมายขีด
    const cleanID = idNumber.replace(/[\s\-]/g, '');
    
    // ตรวจสอบว่ามี 13 หลักและเป็นตัวเลขทั้งหมด
    if (!/^\d{13}$/.test(cleanID)) {
      return false;
    }
    
    // แปลงเป็น array ของตัวเลข
    const digits = cleanID.split('').map(Number);
    
    // ตรวจสอบ checksum ตามสูตรของกรมการปกครอง
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += digits[i] * (13 - i);
    }
    
    const checkDigit = (11 - (sum % 11)) % 10;
    
    return checkDigit === digits[12];
  }

  /**
   * ตรวจสอบและทำความสะอาดเบอร์มือถือไทย
   * @param {string} phoneNumber - เบอร์มือถือที่ต้องการทำความสะอาด
   * @returns {string|null} - เบอร์มือถือที่ทำความสะอาดแล้ว หรือ null ถ้าไม่ถูกต้อง
   */
  static cleanThaiPhoneNumber(phoneNumber) {
    if (!this.validateThaiPhoneNumber(phoneNumber)) {
      return null;
    }
    
    // ทำความสะอาดและคืนค่า
    return phoneNumber.replace(/[\s\-\(\)]/g, '');
  }

  /**
   * ตรวจสอบและทำความสะอาดเลขบัตรประจำตัวประชาชนไทย
   * @param {string} idNumber - เลขบัตรประจำตัวประชาชนที่ต้องการทำความสะอาด
   * @returns {string|null} - เลขบัตรประจำตัวประชาชนที่ทำความสะอาดแล้ว หรือ null ถ้าไม่ถูกต้อง
   */
  static cleanThaiNationalID(idNumber) {
    if (!this.validateThaiNationalID(idNumber)) {
      return null;
    }
    
    // ทำความสะอาดและคืนค่า
    return idNumber.replace(/[\s\-]/g, '');
  }

  /**
   * สร้าง error message สำหรับเบอร์มือถือไทย
   * @param {string} fieldName - ชื่อฟิลด์ (default: 'phoneNumber')
   * @returns {string} - error message
   */
  static getPhoneNumberErrorMessage(fieldName = 'phoneNumber') {
    return `${fieldName} ต้องเป็นเบอร์มือถือไทยที่ถูกต้อง (ขึ้นต้นด้วย 0 และมี 10 หลัก)`;
  }

  /**
   * สร้าง error message สำหรับเลขบัตรประจำตัวประชาชนไทย
   * @param {string} fieldName - ชื่อฟิลด์ (default: 'nationalID')
   * @returns {string} - error message
   */
  static getNationalIDErrorMessage(fieldName = 'nationalID') {
    return `${fieldName} ต้องเป็นเลขบัตรประจำตัวประชาชนไทยที่ถูกต้อง (13 หลัก)`;
  }
}

module.exports = ValidationUtil;