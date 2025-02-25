// you don't need a traditional customer.model.js when using Elasticsearch, as it is a NoSQL search engine that does not require schema definitions like MongoDB or SQL databases. However, you can create a customer.model.js to define a structure for validation and data consistency.

import Joi from "joi";

const customerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  contactInfo: Joi.string().min(1).max(255).required(),
  outstandingAmount: Joi.number().min(0).required(),
  paymentDueDate: Joi.date().iso().required(),
  paymentStatus: Joi.string().valid("Pending", "Completed", "Overdue").required(),
});

export class Customer {
  constructor({
    name,
    contactInfo,
    outstandingAmount,
    paymentDueDate,
    paymentStatus,
  }) {
    this.name = name;
    this.contactInfo = contactInfo;
    this.outstandingAmount = outstandingAmount;
    this.paymentDueDate = paymentDueDate;
    this.paymentStatus = paymentStatus;
  }

  // Validate required fields
  static validate(data) {
    const { error } = customerSchema.validate(data);
    return error ? { error } : { valid: true };
  }
}
// This model defines a Customer class with properties for name, contactInfo, outstandingAmount, paymentDueDate, and paymentStatus. It also includes a validate method to ensure that the required fields are present and that the data adheres to the defined schema.
