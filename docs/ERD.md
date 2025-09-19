# Entity Relationship Diagram (ERD) - Merchandise Portal Platform

## Database Schema Overview

This document outlines the database schema for the Merchandise Portal Platform. The platform is designed to manage merchandise ordering, distribution, and related operations for an organization.

## ERD Diagram

```mermaid
erDiagram
    User ||--o{ Department : "belongs to"
    User ||--o{ Order : "places"
    User ||--o{ Review : "writes"
    User ||--o{ Payment : "makes"
    User ||--o{ IndividualOrder : "has"
    User ||--o{ GroupOrder : "creates"
    User ||--o{ GroupOrderMember : "joins"
    
    Department ||--o{ Product : "has"
    Department ||--o{ User : "has"
    
    Product ||--o{ OrderItem : "included in"
    Product ||--o{ Review : "receives"
    Product ||--o{ DistributionItem : "included in"
    Product ||--o{ FAQ : "has"
    
    Order ||--o{ OrderItem : "contains"
    Order ||--o{ Payment : "receives"
    Order ||--|| IndividualOrder : "can be"
    Order ||--|| GroupOrder : "can be"
    
    GroupOrder ||--o{ GroupOrderMember : "has"
    
    DistributionSchedule ||--o{ DistributionItem : "contains"
    
    User {
        string id PK
        string email UK
        string password
        string firstName
        string lastName
        enum role
        string phone
        string departmentId FK
        datetime createdAt
        datetime updatedAt
    }
    
    Department {
        string id PK
        string name UK
        string description
        datetime createdAt
        datetime updatedAt
    }
    
    Product {
        string id PK
        string name
        string description
        decimal price
        decimal discountPrice
        int stock
        string[] images
        string departmentId FK
        datetime createdAt
        datetime updatedAt
    }
    
    Order {
        string id PK
        string orderNumber UK
        string userId FK
        enum status
        decimal totalAmount
        string shippingAddress
        string notes
        datetime createdAt
        datetime updatedAt
    }
    
    OrderItem {
        string id PK
        string orderId FK
        string productId FK
        int quantity
        decimal unitPrice
        decimal totalPrice
        datetime createdAt
        datetime updatedAt
    }
    
    IndividualOrder {
        string id PK
        string orderId FK UK
        string userId FK
        datetime createdAt
        datetime updatedAt
    }
    
    GroupOrder {
        string id PK
        string orderId FK UK
        string creatorId FK
        string name
        string description
        datetime deadline
        enum status
        datetime createdAt
        datetime updatedAt
    }
    
    GroupOrderMember {
        string id PK
        string groupOrderId FK
        string userId FK
        datetime joinedAt
    }
    
    Payment {
        string id PK
        string orderId FK
        string userId FK
        decimal amount
        enum paymentMethod
        string razorpayId
        enum status
        string transactionId UK
        datetime createdAt
        datetime updatedAt
    }
    
    Review {
        string id PK
        string productId FK
        string userId FK
        int rating
        string comment
        enum status
        datetime createdAt
        datetime updatedAt
    }
    
    DistributionSchedule {
        string id PK
        string name
        string description
        datetime scheduledDate
        enum status
        datetime createdAt
        datetime updatedAt
    }
    
    DistributionItem {
        string id PK
        string distributionScheduleId FK
        string productId FK
        int quantity
        string notes
        datetime createdAt
        datetime updatedAt
    }
    
    FAQ {
        string id PK
        string productId FK
        string question
        string answer
        boolean isPublished
        datetime createdAt
        datetime updatedAt
    }
```

## Model Descriptions

### User
Represents users of the system with different roles (Admin, Manager, Staff, Customer).

### Department
Organizational units that users belong to and that manage products.

### Product
Merchandise items available for ordering, with pricing, stock, and department association.

### Order
Base order entity that can be either an individual or group order.

### OrderItem
Individual items within an order, linking to products with quantity and pricing.

### IndividualOrder
An order placed by a single user.

### GroupOrder
A collaborative order created by one user that others can join.

### GroupOrderMember
Users who have joined a group order.

### Payment
Payment transactions for orders, supporting multiple payment methods including Razorpay.

### Review
Product reviews with ratings and comments, which can be open or closed.

### DistributionSchedule
Scheduled events for distributing products.

### DistributionItem
Specific products included in a distribution schedule.

### FAQ
Frequently asked questions related to specific products.

## Relationships

1. Users belong to Departments (optional)
2. Products belong to Departments
3. Orders are placed by Users
4. OrderItems belong to Orders and reference Products
5. IndividualOrders and GroupOrders extend the Order entity
6. GroupOrders have GroupOrderMembers (Users who joined)
7. Payments are linked to Orders and Users
8. Reviews are written by Users for Products
9. DistributionItems belong to DistributionSchedules and reference Products
10. FAQs are associated with Products

## Enums

### UserRole
- ADMIN
- MANAGER
- STAFF
- CUSTOMER

### OrderStatus
- PENDING
- PROCESSING
- SHIPPED
- DELIVERED
- CANCELLED

### GroupOrderStatus
- OPEN
- CLOSED
- CANCELLED

### PaymentMethod
- RAZORPAY
- CREDIT_CARD
- DEBIT_CARD
- UPI
- BANK_TRANSFER

### PaymentStatus
- PENDING
- COMPLETED
- FAILED
- REFUNDED

### ReviewStatus
- OPEN
- CLOSED

### DistributionStatus
- PENDING
- IN_PROGRESS
- COMPLETED
- CANCELLED