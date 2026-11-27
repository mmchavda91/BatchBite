# 🍱 BatchBite – होम फूड बिजनेस मैनेजमेंट प्लेटफॉर्म

> **एक पूरा MERN Stack (MongoDB, Express.js, React.js, Node.js) वेब एप्लिकेशन** — घरेलू शेफ और होम किचन के लिए, जो अपने खाने की बैच, प्री-ऑर्डर, स्टॉक और कस्टमर पिकअप को आसानी से मैनेज करना चाहते हैं।

---

## ⚡ आपके सभी सवालों के सीधे जवाब

### ❓ सवाल 1: MongoDB काम कर रहा है या नहीं?
✅ **हाँ! MongoDB 100% चालू और कनेक्टेड है।**
- **Database URL:** `mongodb://127.0.0.1:27017/batchbite`
- Seed script सफलतापूर्वक चल गई है — Demo products, 4 Active Batches, Owner और Customer दोनों accounts MongoDB में save हो गए हैं।

---


### ❓ सवाल 2: लॉगिन कहाँ करें? कौन सा Port किसके लिए है?

| पोर्ट | क्या है | ब्राउज़र में खोलें? |  
|---|---|---| 
| **Port 3000** | Frontend (React Website) | ✅ हाँ — `http://localhost:3000` |
| **Port 5000** | Backend (Node.js API Server) | ❌ नहीं — यह React खुद बुलाता है |

> 💡 **ध्यान रखें:** Application चलाते समय **दोनों Ports (3000 और 5000)** एक साथ चालू होने चाहिए!

---

### ❓ सवाल 3: "Priya" का नाम कहाँ था और कैसे बदला?

**नाम `Server/seed.js` फ़ाइल में था।**

यह फ़ाइल डेटाबेस में Demo Data (यानी test accounts और sample products) डालती है।

**पुराना code था:**
```javascript
name: 'Priya Sharma',
email: 'customer@batchbite.com',
```

**अब नया code है:**
```javascript
name: 'Mamta',
email: 'customer@batchbite.com',
```

> नाम बदलने के बाद `seed.js` एक बार फिर से चलाएं (नीचे देखें) ताकि नया नाम Database में save हो जाए।

---

## 🚀 Application कैसे चलाएं (Step-by-Step)

**दो अलग-अलग Terminal/PowerShell Window खोलें:**

### Terminal 1 — Backend Server चालू करें (Port 5000)
```powershell
cd E:\BatchBite\batchbite\Server
node seed.js
npm run dev
```
> ✅ सफलता का संदेश: `Server running on port 5000` और `MongoDB Connected`

### Terminal 2 — Frontend Website चालू करें (Port 3000)
```powershell
cd E:\BatchBite\batchbite
npm start
```
> ✅ Browser अपने आप `http://localhost:3000` खुल जाएगा!

---

## 🔐 Demo Login Accounts (तैयार हैं)

| भूमिका | Email | Password | लॉगिन Page |
|---|---|---|---|
| 🍱 **Customer (ग्राहक)** | `customer@batchbite.com` | `customer123` | `http://localhost:3000/login` |
| 👨‍🍳 **Business Owner (मालिक)** | `owner@batchbite.com` | `owner123` | `http://localhost:3000/owner/login` |

> 💡 **Tip:** Login Page पर जाएं और **"Auto-Fill"** बटन दबाएं — Email और Password अपने आप भर जाएंगे!

---

## 🌐 API कैसे काम करता है? (सरल भाषा में)

```
[React Page / Component]  (जैसे: Login.js, ProductDetail.js, Cart.js)
       │
       ▼
[src/services/api.js]
  → Axios Instance (baseURL: 'http://localhost:5000/api')
  → Request Interceptor: JWT Token automatically headers में जोड़ता है
  → Response Interceptor: 401 error पर session साफ करता है
       │
       ▼
[Express Server: Server/server.js]  (Port 5000)
  ├── /api/auth       → Login, Register, Profile
  ├── /api/products   → Products CRUD
  ├── /api/batches    → Batch Schedule CRUD
  ├── /api/orders     → Place Order, Track, Cancel
  └── /api/business   → Dashboard, Orders, Reports
       │
       ▼
[MongoDB Database (Mongoose ODM)] (User, Business, Product, Batch, Order)
       │
       ▼
[JSON Response]: { success: true, data: { ... } }
```

---

## 🍃 MongoDB और Mongoose का उपयोग (Complete Database Guide)

इस प्रोजेक्ट में डेटाबेस के लिए **MongoDB** और **Mongoose** का इस्तेमाल बहुत ही एडवांस्ड और प्रोडक्शन लेवल पर किया गया है। यहाँ समझें कि इनका इस्तेमाल क्यों और कैसे किया गया है:

### 1. MongoDB और Mongoose में क्या अंतर है? (What & Why?)

* **MongoDB (Database):** यह एक NoSQL डेटाबेस है। इसमें डेटा SQL की तरह rows/columns में नहीं, बल्कि JSON जैसे **Documents** में स्टोर होता है। यह बहुत तेज़ और फ्लेक्सिबल है।
* **Mongoose (ODM - Object Data Modeling):** यह Node.js और MongoDB के बीच का **पुल (Bridge)** है। MongoDB में कोई भी डेटा सीधे बिना नियम के जा सकता है, लेकिन Mongoose हमें **Schema (नियम/ढांचा), Data Validation, Password Encryption और Relationships** बनाने की सुविधा देता है।

---

### 2. `Server/config/db.js` में क्या किया गया है? (Database Connection)

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};
```
* `process.env.MONGODB_URI` से `mongodb://localhost:27017/batchbite` पर सुरक्षित कनेक्शन बनाया गया है।
* अगर डेटाबेस किसी कारण से कनेक्ट न हो पाए तो यह तुरंत error पकड़ता है और सर्वर को सुरक्षित रूप से बंद कर देता है।

---

### 3. बनाए गए 5 मुख्य Tables (Mongoose Collections & Schemas)

`Server/models/` फोल्डर में 5 अलग-अलग Schemas बनाए गए हैं:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   User Model    │ ───►  │ Business Model  │ ───►  │  Product Model  │
│ (Customer/Owner)│       │ (Kitchen Info)  │       │ (Food Dish/Menu)│
└─────────────────┘       └─────────────────┘       └─────────────────┘
         │                                                   │
         │ (Customer Places Order)                           ▼ (Added into)
         │                                          ┌─────────────────┐
         └────────────────────────────────────────► │   Batch Model   │
                                                    │(Date,Qty,Timer) │
                                                    └─────────────────┘
                                                             │
                                                             ▼ (Ordered via)
                                                    ┌─────────────────┐
                                                    │   Order Model   │
                                                    │(Tracking & Bill)│
                                                    └─────────────────┘
```

#### A. User Table (`Server/models/User.js`)
* **मकसद:** ग्राहकों (Customer) और किचन मालिकों (Owner) का अकाउंट संभालना।
* **Mongoose Fields:**
  * `name`: String, required (जैसे: *Mata*)
  * `email`: String, required, unique, lowercase, regex validation
  * `password`: String, required, minlength: 6 (Hashed)
  * `role`: String, enum: `['customer', 'owner']` (डिफ़ॉल्ट `'customer'`)
  * `phone`: String, required
  * `address`: String

#### B. Business Table (`Server/models/Business.js`)
* **मकसद:** होम शेफ के किचन की ब्रांडिंग और प्रोफाइल संभालना।
* **Mongoose Fields:**
  * `owner`: `mongoose.Schema.Types.ObjectId`, ref: `'User'` (मालिक से लिंक)
  * `businessName`: String, required (जैसे: *BatchBite Home Kitchen*)
  * `description`: String
  * `address`: String (पिकअप लोकेशन)
  * `logo`: String (फोटो पाथ)
  * `cuisineTypes`: Array of Strings (`['Indian', 'Biryani', 'Desserts']`)
  * `totalOrders`, `totalProducts`: Number, default: 0

#### C. Product Table (`Server/models/Product.js`)
* **मकसद:** शेफ के डिश कैटलॉग (Menu) का रिकॉर्ड रखना।
* **Mongoose Fields:**
  * `business`: `mongoose.Schema.Types.ObjectId`, ref: `'Business'`
  * `name`: String, required (जैसे: *Butter Chicken & Naan*)
  * `category`: String, enum: Indian, Chinese, Desserts, etc.
  * `price`: Number, required (Base Price)
  * `image`: String (Unsplash URL या Local Upload)
  * `preparationTime`: Mixed (Number या String जैसे: 45 mins)
  * `allergens`: Array of Strings (`['Dairy', 'Nuts']`)
  * `isAvailable`: Boolean, default: true

#### D. Batch Table (`Server/models/Batch.js`) — ⭐ सबसे महत्वपूर्ण
* **मकसद:** किस तारीख को कौन सी डिश कितनी प्लेट्स बनेगी और कब तक ऑर्डर लिया जाएगा।
* **Mongoose Fields:**
  * `product`: `mongoose.Schema.Types.ObjectId`, ref: `'Product'`
  * `business`: `mongoose.Schema.Types.ObjectId`, ref: `'Business'`
  * `batchName`: String, required
  * `totalQuantity`: Number (कुल कितनी प्लेट्स बनेंगी)
  * `availableQuantity`: Number (अभी कितनी प्लेट्स बाकी हैं)
  * `reservedQuantity`: Number (कितनी बुक हो गईं)
  * `pricePerUnit`: Number
  * `preparationDate`: Date (पकाने का दिन)
  * `orderDeadline`: Date (ऑर्डर क्लोज होने का टाइमर)
  * `pickupStartTime` & `pickupEndTime`: Mixed (जैसे: 12:30 PM)
  * `status`: String, enum: `['active', 'closed', 'completed', 'cancelled']`

#### E. Order Table (`Server/models/Order.js`)
* **मकसद:** ग्राहक के प्री-ऑर्डर, बिलिंग और लाइव कुकिंग ट्रैकिंग का रिकॉर्ड।
* **Mongoose Fields:**
  * `customer`: `mongoose.Schema.Types.ObjectId`, ref: `'User'`
  * `business`: `mongoose.Schema.Types.ObjectId`, ref: `'Business'`
  * `items`: Array of Objects:
    * `batch`: ref `'Batch'`
    * `product`: ref `'Product'`
    * `quantity`: Number
    * `pricePerUnit`: Number
    * `subtotal`: Number
  * `totalAmount`: Number (सर्वर पर कैलकुलेट किया गया कुल बिल)
  * `status`: String, enum: `['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled', 'rejected']`
  * `statusHistory`: Array (`[{ status, changedAt, note }]`)
  * `specialInstructions`: String (जैसे: *कम तीखा, extra चटनी*)
  * `pickupDetails`: String (ग्राहक के आने का समय)

---

### 4. Mongoose के 5 शक्तिशाली फीचर्स जो इस प्रोजेक्ट में यूज़ हुए हैं

#### ① Population (टेबल्स को आपस में जोड़ना - Joins)
MongoDB में SQL की तरह `JOIN` नहीं होता, इसलिए Mongoose का `.populate()` इस्तेमाल किया गया है:
```javascript
// एक ही क्वेरी से Batch के साथ उसकी Product और Business की पूरी जानकारी निकालना:
const batch = await Batch.findById(req.params.id)
  .populate('product', 'name price category image allergens')
  .populate('business', 'businessName phone address');
```

#### ② Pre-Save Hook (पासवर्ड एन्क्रिप्शन)
यूज़र जब भी रजिस्टर करता है या पासवर्ड बदलता है, Mongoose का `pre('save')` मिडलवेयर पासवर्ड को डेटाबेस में जाने से पहले अपने आप **Bcrypt (10 Salt Rounds)** से एन्क्रिप्ट कर देता है:
```javascript
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

#### ③ Atomic Stock Update (स्टॉक मैनेजमेंट और ओवर-सेलिंग से बचाव)
अगर 2 लोग एक ही समय ऑर्डर करें, तो Mongoose के `$inc` ऑपरेटर से डेटाबेस में रियल-टाइम में सुरक्षित तरीके से स्टॉक घटता है:
```javascript
// ऑर्डर सफल होने पर स्टॉक घटाना:
await Batch.findByIdAndUpdate(item.batchId, {
  $inc: {
    availableQuantity: -item.quantity,
    reservedQuantity: item.quantity,
  },
});

// ऑर्डर कैंसिल होने पर स्टॉक तुरंत वापस लौटाना:
await Batch.findByIdAndUpdate(item.batch, {
  $inc: {
    availableQuantity: item.quantity,
    reservedQuantity: -item.quantity,
  },
});
```

#### ④ Strict Schema Validation (गलत डेटा रोकना)
* अगर कोई खाली नाम या गलत ईमेल डालेगा, तो Mongoose एरर थ्रो करेगा।
* अगर कोई रोल में `'admin'` डालने की कोशिश करेगा, तो `enum` उसे रोक देगा (सिर्फ `'customer'` या `'owner'` ही मान्य है)।
* `min: 0` नियम से स्टॉक कभी भी माइनस (Negative) में नहीं जा सकता।

#### ⑤ CRUD Operations (कंट्रोलर्स में उपयोग)
* **Create (नया जोड़ना):** `User.create()`, `Product.create()`, `Order.create()`
* **Read (डेटा ढूंढना):** `Batch.find({ status: 'active' })`, `Order.findById(id)`
* **Update (बदलना):** `Order.findByIdAndUpdate(id, { status: 'preparing' })`
* **Delete (हटाना):** `Product.findByIdAndDelete(id)`
* **Sorting (क्रमबद्ध करना):** `.sort({ createdAt: -1 })` (सबसे नया ऑर्डर पहले)

---

### 5. डेटाबेस के सभी Tables और Records को कैसे देखें? (3 आसान तरीके)

अगर आप अपने कंप्यूटर पर देखना चाहते हैं कि Database में कौन से Tables बने हैं और क्या Data सेव हुआ है, तो ये 3 तरीके हैं:

#### तरीका 1: टर्मिनल से तुरंत देखें (सबसे आसान — कोई नया सॉफ्टवेयर इंस्टॉल करने की ज़रूरत नहीं)
हमने प्रोजेक्ट में एक खास टूल बना दिया है। अपने PowerShell/Terminal में बस यह कमांड चलाएं:
```powershell
npm run db
# या
node Server/view-db.js
```
👉 यह तुरंत आपके स्क्रीन पर सभी 5 Collections (users, businesses, products, batches, orders), उनके अंदर सेव हुए यूज़र्स (Mata, Owner), डिशेस, स्टॉक और ऑर्डर्स सुंदर फ़ॉर्मेट में दिखा देगा!

#### तरीका 2: MongoDB Compass सॉफ्टवेयर से देखें (Official Visual GUI)
1. अपने कंप्यूटर पर **MongoDB Compass** खोलें (अगर नहीं है तो [mongodb.com/products/tools/compass](https://www.mongodb.com/products/tools/compass) से फ्री डाउनलोड करें)।
2. Connection String में डालें: `mongodb://localhost:27017`
3. **"Connect"** बटन दबाएं।
4. बाईं तरफ **`batchbite`** डेटाबेस दिखेगा।
5. `batchbite` पर क्लिक करते ही आपको सभी 5 Tables (Collections) दिखेंगे:
   - `users`
   - `businesses`
   - `products`
   - `batches`
   - `orders`
6. किसी भी टेबल पर क्लिक करके आप सारा डेटा देख सकते हैं, सर्च कर सकते हैं या नया रिकॉर्ड जोड़ सकते हैं।

#### तरीका 3: VS Code Extension से देखें
1. VS Code में Extensions टैब खोलें (`Ctrl + Shift + X`).
2. Search करें: **"MongoDB for VS Code"** और Install करें।
3. बाईं पट्टी पर हरे रंग का पत्ती (Leaf) जैसा MongoDB आइकन दिखेगा।
4. `Connect with Connection String` चुनकर `mongodb://localhost:27017` डालें।
5. सीधे VS Code के अंदर ही सारा डेटाबेस एक्सप्लोर करें!


---

## 📖 हर Page में क्या करें? (पूरी Guide)

### 1. CUSTOMER PANEL (ग्राहक के लिए)

#### A. Home Page (`/`)
- **क्या दिखेगा:** आज की ताज़ी Food Batch, Categories (Indian, Biryani, Desserts, Snacks)
- **क्या करें:**
  - किसी भी Dish Card पर **"+ Add to Cart"** दबाएं
  - Dish पर Click करके पूरी जानकारी देखें

#### B. Browse Batches (`/products`)
- **क्या करें:**
  - Search Bar में Dish का नाम लिखें (जैसे `Biryani`, `Paneer`, `Brownie`)
  - Category Button दबाकर Filter करें
  - Sort करें — Price Low to High या Closing Soonest

#### C. Batch Detail Page (`/products/:id`)
- **क्या दिखेगा:**
  - Dish की High Quality Photo
  - Live Countdown Timer — Order कब बंद होगा
  - बची हुई Plates की संख्या (Stock)
  - Chef का Pickup Address और समय
  - Allergens (एलर्जी की जानकारी)
- **क्या करें:**
  - `+` / `-` बटन से Quantity चुनें
  - **"Add to Cart"** या **"Pre-Order Now"** दबाएं

#### D. Shopping Cart (`/cart`)
- **क्या करें:**
  - Quantity बढ़ाएं/घटाएं
  - Total Amount चेक करें
  - **"Proceed to Checkout →"** पर Click करें

#### E. Checkout Page (`/checkout`)
> ⚠️ Checkout के लिए Login ज़रूरी है।
- **क्या भरें:**
  1. **Contact Phone:** अपना Mobile Number (Chef संपर्क कर सके)
  2. **Pickup Details:** आप कब Pickup करने आएंगे (जैसे *"Will come at 1:30 PM"*)
  3. **Special Instructions:** खाने की खास Instructions (जैसे *"कम मसाला"*, *"Extra Chutney"*)
  4. **"Confirm & Place Pre-Order 🍱"** दबाएं

#### F. Order Tracking (`/my-orders/:id`)
- **Live Stage Timeline:**
  `Order Placed` ➔ `Confirmed` ➔ `Preparing` ➔ `Ready for Pickup` ➔ `Completed`
- अगर Order अभी Preparing नहीं हुआ है तो **"Cancel Order"** दबाकर रद्द कर सकते हैं — Stock अपने आप वापस आ जाएगा।

---

### 2. BUSINESS OWNER ADMIN PANEL (किचन मालिक के लिए)

Navbar में ऊपर दाईं तरफ **"Owner Login"** दबाएं या `http://localhost:3000/owner/login` खोलें।

#### A. Kitchen Dashboard (`/owner/dashboard`)
- **क्या दिखेगा:**
  - Total Revenue (₹ में कुल कमाई)
  - Total Orders (कुल आए Orders)
  - Pending Orders (जिन्हें Confirm करना है)
  - Active Batches (अभी चल रही Batches)
  - 7-Day Sales Chart (Recharts Graph)
  - Low Stock Alerts (जब Batch में कम Plates बचें)

#### B. नई Dish जोड़ें (`/owner/products/add`)
1. **Dish Name:** Dish का नाम (जैसे *Hyderabadi Biryani*)
2. **Category:** Dropdown से चुनें (*Indian*, *Biryani & Rice*, *Desserts* आदि)
3. **Base Price:** 1 Plate की कीमत (जैसे *250*)
4. **Prep Time:** बनाने में लगने वाला समय (जैसे *45 mins*)
5. **Description:** Dish का विवरण
6. **Allergens:** एलर्जी वाली सामग्री (जैसे *Dairy, Nuts*)
7. **Product Photo:** अपने Computer से Dish की Photo Upload करें
8. **"Create Product 🍱"** दबाएं

#### C. Food Batch Schedule करें (`/owner/batches/add`)
किस दिन कौन सी Dish कितनी Plate बनाएंगे:
1. **Select Dish:** अपनी बनाई Dish चुनें
2. **Batch Name:** Batch का नाम (जैसे *Friday Lunch Special Biryani*)
3. **Price Per Unit:** इस Batch की Price
4. **Total Quantity:** कितनी Plates बनाएंगे
5. **Preparation Date:** Calendar से तारीख चुनें
6. **Order Deadline:** Orders लेने की आखिरी समय (Delivery से 4 घंटे पहले)
7. **Pickup Window:** Customer कब आ सकता है (जैसे *12:30 PM – 2:30 PM*)
8. **Pickup Location:** अपना घर/किचन का Address
9. **"Schedule Batch 📦"** दबाएं — यह Batch तुरंत Customer Site पर Live हो जाएगी!

#### D. Customer Orders Manage करें (`/owner/orders`)
- सभी Customer Orders यहाँ दिखती हैं
- एक Click में Status बदलें:
  - `pending` ➔ `confirmed` (Order स्वीकार किया)
  - `confirmed` ➔ `preparing` (खाना बनना शुरू)
  - `preparing` ➔ `ready` (Packed, Pickup के लिए तैयार)
  - `ready` ➔ `completed` (Customer ले गया)
  - `rejected` (अगर Order नहीं ले सकते — Stock वापस आ जाएगा)

#### E. Business Profile (`/owner/profile`)
- Kitchen का नाम, Phone, Address और Logo update करें

#### F. Sales Reports (`/owner/reports`)
- पिछले 7 दिनों की Daily Sales, Graph और Print Report

---

## 📁 Project की File Structure (कौन सी File कहाँ है?)

```
E:\BatchBite\batchbite\
│
├── src/                        ← Frontend (React.js)
│   ├── components/
│   │   ├── Navbar.js           ← Navigation Bar
│   │   ├── Footer.js           ← Footer
│   │   ├── BatchCard.js        ← Home/Browse पेज का Food Card
│   │   ├── OrderStatusBadge.js ← Colorful Order Status Badge
│   │   ├── ProtectedRoute.js   ← Customer Security
│   │   └── OwnerRoute.js       ← Owner Security
│   │
│   ├── contexts/
│   │   ├── AuthContext.js      ← JWT Login/Logout Global State
│   │   └── CartContext.js      ← Shopping Cart और Stock Calculation
│   │
│   ├── pages/                  ← Customer Pages
│   │   ├── Home.js             ← Home Page
│   │   ├── Products.js         ← Browse और Search Batches
│   │   ├── ProductDetail.js    ← Dish Detail और Pickup Info
│   │   ├── Cart.js             ← Shopping Cart
│   │   ├── Checkout.js         ← Pre-Order Submit
│   │   ├── OrderConfirmation.js← Order Confirmation Screen
│   │   ├── MyOrders.js         ← Order History
│   │   ├── OrderTracking.js    ← Live Stage Tracking
│   │   ├── Login.js            ← Customer Login
│   │   ├── Register.js         ← Customer Register
│   │   └── Profile.js          ← Customer Profile
│   │
│   ├── pages/owner/            ← Admin/Owner Pages
│   │   ├── OwnerLogin.js       ← Owner Login + Register
│   │   ├── OwnerLayout.js      ← Sidebar Layout
│   │   ├── OwnerDashboard.js   ← Main Dashboard + Charts
│   │   ├── OwnerProducts.js    ← Dish List Table
│   │   ├── AddProduct.js       ← New Dish Form
│   │   ├── EditProduct.js      ← Dish Edit
│   │   ├── OwnerBatches.js     ← Batch Management
│   │   ├── AddBatch.js         ← New Batch Schedule
│   │   ├── EditBatch.js        ← Batch Edit
│   │   ├── OwnerOrders.js      ← Customer Orders और Status Update
│   │   ├── BusinessProfile.js  ← Kitchen Profile और Logo
│   │   └── SalesReport.js      ← 7-Day Sales Reports
│   │
│   ├── services/
│   │   └── api.js              ← सभी Backend API Calls (Axios)
│   │
│   └── utils/
│       └── helpers.js          ← Image URL, Time, Currency Formatting
│
└── Server/                     ← Backend (Node.js + Express)
    ├── server.js               ← Express Entry Point (Port 5000)
    ├── seed.js                 ← ⭐ Demo Data Script (यहाँ "Mata" नाम है)
    ├── .env                    ← Environment Variables (MongoDB URI, JWT Secret)
    ├── models/                 ← Database Schemas
    │   ├── User.js
    │   ├── Business.js
    │   ├── Product.js
    │   ├── Batch.js
    │   └── Order.js
    ├── controllers/            ← Business Logic
    │   ├── authController.js
    │   ├── productController.js
    │   ├── batchController.js
    │   ├── orderController.js
    │   └── businessController.js
    ├── routes/                 ← API Routes
    ├── middleware/             ← Auth, Error Handler, Upload
    └── uploads/               ← Uploaded Product Photos
```

---

## 🛠️ Technology Stack

| Technology | उपयोग |
|---|---|
| **React.js** | Frontend UI |
| **Redux Toolkit** | Global State Management |
| **React Router DOM v7** | Page Navigation |
| **Axios** | API Calls |
| **Bootstrap 5** | Responsive Design |
| **React Icons** | Icons |
| **Recharts** | Sales Charts |
| **React-Toastify** | Toast Notifications |
| **Node.js + Express.js** | Backend API Server |
| **MongoDB + Mongoose** | Database |
| **JWT + Bcrypt** | Authentication और Security |
| **Multer** | Photo Upload |

---

## 🔧 Troubleshooting (समस्याओं का हल)

| समस्या | हल |
|---|---|
| `Network Error` या `ERR_CONNECTION_REFUSED` | Backend Terminal में `npm run dev` चला रहा है? Port 5000 चालू है? |
| `Missing script: "dev"` | Root Folder में हैं? `cd E:\BatchBite\batchbite\Server` करें |
| Dashboard में पुराना नाम दिख रहा है? | `cd Server; node seed.js` चलाएं — नया "Mata" नाम Database में save हो जाएगा |
| Login नहीं हो रहा? | "Auto-Fill" बटन दबाएं या seed.js से Password Reset करें |
| Photos नहीं दिख रहीं? | Backend (Port 5000) चालू है? Internet है? |

---

## 🏆 Business Rules (ज़रूरी नियम)

| नियम | क्या होता है |
|---|---|
| ✅ Deadline के बाद Order नहीं | Server-side check होता है |
| ✅ Stock से ज़्यादा Order नहीं | Overselling prevent किया जाता है |
| ✅ Price Server पर Calculate होती है | Frontend से tamper नहीं हो सकती |
| ✅ Order Cancel होने पर Stock वापस | Automatic Stock Restore |
| ✅ Customer को सिर्फ अपने Orders दिखते हैं | Role-based Security |
| ✅ Owner को सिर्फ अपना Business Data | Isolated Business Data |

---

## 🎤 इंटरव्यू में प्रोजेक्ट कैसे समझाएं? (Complete Interview Preparation Guide)

> **यह सेक्शन खास आपके इंटरव्यू की तैयारी के लिए बनाया गया है।** जब भी इंटरव्यूअर आपसे प्रोजेक्ट के बारे में पूछे, तो नीचे दिए गए स्टेप्स को क्रमवार (Step-by-Step) बोलें ताकि इंटरव्यूअर को साफ दिखे कि आपके **Frontend, Backend और MongoDB کے Basic & Advanced Concepts 100% Clear** हैं!

---

### 🌟 स्टेप 1: प्रोजेक्ट का 1-मिनट का परिचय (Elevator Pitch)

> 🗣️ **इंटरव्यूअर को ऐसे बोलें:**
> 
> *"Sir/Ma'am, BatchBite एक Full-Stack MERN (MongoDB, Express.js, React.js, Node.js) Web Application है, जो खास तौर पर Home Chefs, Cloud Kitchens और Local Food Artisans के लिए डिज़ाइन किया गया है।
> 
> ट्रेडिशनल रेस्टोरेंट ऐप्स में खाना ऑन-डिमांड तुरंत बनता है, लेकिन होम शेफ्स सीमित मात्रा में और ताज़ा खाना बनाते हैं। BatchBite में **'Batch-Based Food Scheduling & Pre-Order System'** है — शेफ अपनी डिश की तारीख, सीमित क्वांटिटी (जैसे 20 प्लेट्स), ऑर्डर की डेडलाइन और पिकअप विंडो तय करता है। ग्राहक डेडलाइन से पहले प्री-ऑर्डर बुक करते हैं, और शेफ अपने डैशबोर्ड से रियल-टाइम ऑर्डर्स, लाइव स्टेटस (Pending ➔ Preparing ➔ Ready ➔ Completed), 7-दिनों का सेल्स ग्राफ और इन्वेंटरी मैनेज करता है।
> 
> इस पूरे प्रोजेक्ट में मैंने **Role-Based JWT Authentication**, **Atomic Stock Management ($inc)** जिससे ओवर-सेलिंग न हो, **Centralized Error Handling**, और **Responsive Dashboard with Recharts** जैसी चीजें खुद इम्प्लीमेंट की हैं।"*

---

### 💻 स्टेप 2: Frontend (React.js) साइड कैसे समझाएं?

जब इंटरव्यूअर पूछे: *"Frontend में आपने क्या-क्या किया है और कैसे स्ट्रक्चर किया है?"*

#### 1. Tech Stack & Libraries
* **React.js 19**: Component-based UI लाइब्रेरी।
* **Redux Toolkit & Context API**: Global State Management (Auth & Cart)।
* **React Router DOM (v7)**: Client-side Single Page Application (SPA) Routing।
* **Axios**: HTTP Client, Interceptors के साथ।
* **Bootstrap 5 & Custom CSS**: Responsive UI, Modern Color Palette (Warm Cream, Orange, Dark Green)।
* **React Icons & Recharts**: Clean Dashboard Data Visualization।
* **React-Toastify**: यूजर-फ्रेंडली पॉपअप नोटिफिकेशन्स।

#### 2. Architecture & Folder Structure (फाइलें कैसे बांटी हैं?)
* **`src/components/`**: री-यूजेबल कंपोनेंट्स (जैसे: `Navbar.js`, `Footer.js`, `BatchCard.js`, `OrderStatusBadge.js`)।
* **`src/pages/`**: कस्टमर के मुख्य पेजेस (`Home`, `Products`, `ProductDetail`, `Cart`, `Checkout`, `MyOrders`, `OrderTracking`, `Profile`)।
* **`src/pages/owner/`**: बिजनेस ओनर का पूरा एडमिन पैनल (`OwnerDashboard`, `OwnerProducts`, `AddProduct`, `OwnerBatches`, `AddBatch`, `OwnerOrders`, `SalesReport`)।
* **`src/services/api.js`**: सेंट्रलाइज्ड Axios इंस्टेंस जहाँ सारे API कॉल्स एक जगह लिखे गए हैं।
* **`src/contexts/` & `src/redux/`**: ग्लोबल स्टेट मैनेजमेंट।

#### 3. Frontend के मुख्य Concepts जो आपको इंटरव्यू में बोलने हैं:

##### A. State Management (Redux Toolkit + Context API)
* *"मैंने शॉपिंग कार्ट और ऑथेंटिकेशन के लिए स्टेट मैनेजमेंट का उपयोग किया है। कार्ट में जब भी कोई आइटम जुड़ता है, तो उसकी क्वांटिटी, बैच आईडी और प्राइस ग्लोबली अपडेट होती है और `localStorage` में सिंक होती है ताकि पेज रिफ्रेश होने पर भी यूजर का कार्ट खाली न हो।"*

##### B. Protected Routes & Role-Based Authorization
* *"मैंने दो कस्टम रूट प्रोटेक्टर्स बनाए हैं:*
  1. **`<ProtectedRoute>`**: यह चेक करता है कि यूजर के पास वैध JWT टोकन है या नहीं। अगर गेस्ट यूजर चेकआउट करने की कोशिश करे, तो यह उसे सीधे `/login` पर रीडायरेक्ट कर देता है।
  2. **`<OwnerRoute>`**: यह चेक करता है कि यूजर का रोल `owner` है या नहीं। अगर कोई साधारण कस्टमर किचन डैशबोर्ड (`/owner/dashboard`) खोलने की कोशिश करे, तो यह उसे रोक देता है।"*

##### C. Axios Interceptors (बहुत महत्वपूर्ण सवाल!)
* *"मैंने `src/services/api.js` में दो तरह के Interceptors लगाए हैं:*
  1. **Request Interceptor**: यह हर बाहर जाने वाली API रिक्वेस्ट में `localStorage` से JWT टोकन निकालकर `headers: { Authorization: 'Bearer <token>' }` अपने आप जोड़ देता है। इससे हमें हर API कॉल में बार-बार टोकन मैन्युअली पास नहीं करना पड़ता।
  2. **Response Interceptor**: अगर बैकएंड से `401 Unauthorized` एरर आता है (टोकन एक्सपायर होने पर), तो यह लोकल स्टोरेज से टोकन हटाता है और यूजर को सुरक्षित लॉगिन पेज पर भेज देता है।"*

##### D. React Lifecycle & Custom Hooks
* *"मैंने `useState`, `useEffect`, `useCallback` और कस्टम हुक्स (`useAuth()`, `useCart()`) का इस्तेमाल किया है। जैसे बैच डिटेल पेज पर जाते ही `useEffect` बैकएंड से सिंगल बैच का डेटा लाता है और लाइव काउंटडाउन टाइमर कैलकुलेट करता है।"*

---

### ⚙️ स्टेप 3: Backend (Node.js & Express.js) साइड कैसे समझाएं?

जब इंटरव्यूअर पूछे: *"Backend में क्या आर्किटेक्चर यूज़ किया है और APIs कैसे बनाई हैं?"*

#### 1. MVC (Model-View-Controller) Architecture
* *"मेरा बैकएंड MVC पैटर्न और लेयर्ड आर्किटेक्चर फॉलो करता है:*
  * **Routes (`Server/routes/`)**: सिर्फ URL एंडपॉइंट्स डिफाइन करते हैं और मिडलवेयर अटैच करते हैं।
  * **Controllers (`Server/controllers/`)**: इनमें सारा बिजनेस लॉजिक होता है (जैसे: स्टॉक चेक करना, पासवर्ड मैच करना, प्राइस कैलकुलेट करना)।
  * **Models (`Server/models/`)**: डेटाबेस स्कीमा और Mongoose मेथड्स।
  * **Middleware (`Server/middleware/`)**: टोकन वेरिफिकेशन (`auth.js`), एरर हैंडलिंग (`errorHandler.js`), और फोटो अपलोड (`upload.js`)।"*

#### 2. RESTful API Design Standards
* *"मैंने इंडस्ट्री के मानक REST प्रिंसिपल्स फॉलो किए हैं:*
  * **Proper HTTP Verbs**: डेटा लाने के लिए `GET`, नया बनाने के लिए `POST`, अपडेट के लिए `PUT`, हटाने के लिए `DELETE`।
  * **Standard Status Codes**: सफलता पर `200 OK`, नया रिकॉर्ड बनने पर `201 Created`, वैलिडेशन एरर पर `400 Bad Request`, बिना टोकन पर `401 Unauthorized`, परमिशन न होने पर `403 Forbidden`, रिकॉर्ड न मिलने पर `404 Not Found`।
  * **Uniform JSON Response Format**: सभी APIs एक जैसा रिस्पॉन्स देती हैं:
    ```json
    { "success": true, "message": "...", "data": { ... } }
    ```
    इससे फ्रंटएंड पर डेटा कंज्यूम करना बहुत आसान और प्रेडिक्टेबल हो जाता है।"*

#### 3. Authentication & Security (JWT + Bcrypt)
* *"सिक्योरिटी के लिए:*
  1. **Password Hashing**: यूजर का पासवर्ड डेटाबेस में प्लेन टेक्स्ट में कभी सेव नहीं होता। Mongoose के `pre('save')` हुक में **Bcrypt (10 Salt Rounds)** के साथ पासवर्ड को हैश किया जाता है।
  2. **JWT Authentication**: लॉगिन सफल होने पर सर्वर यूजर आईडी और रोल के साथ एक साइन किया हुआ **JWT (JSON Web Token)** जारी करता है।
  3. **Role Middleware**: बैकएंड पर `protect` मिडलवेयर टोकन को `jwt.verify()` से वेरिफाई करता है और `authorize('owner')` मिडलवेयर यह पक्का करता है कि सिर्फ किचन ओनर ही नई बैच बना सके या स्टेटस बदल सके।"*

#### 4. Server-Side Calculations & Business Rules
* *"मैंने एक बेहद महत्वपूर्ण सिक्योरिटी नियम लागू किया है — **कार्ट का टोटल कभी भी फ्रंटएंड से ट्रस्ट नहीं किया जाता!**
  अगर फ्रंटएंड से कोई प्राइस बदल दे (Inspect Element से), तो भी बैकएंड पर हम हर आइटम की असली प्राइस डेटाबेस की `Batch` टेबल से निकालकर सर्वर पर टोटल कैलकुलेट करते हैं। इससे प्राइस फ्रॉड पूरी तरह रुक जाता है।"*

#### 5. Centralized Error Handling
* *"पूरे बैकएंड में किसी भी कंट्रोलर में एरर आने पर `next(error)` कॉल होता है। अंत में `errorHandler.js` मिडलवेयर उस एरर को पकड़कर यूजर-फ्रेंडली एरर मैसेज लौटाता है, जिससे सर्वर कभी क्रैश नहीं होता।"*

---

### 🍃 स्टेप 4: Database (MongoDB & Mongoose) कैसे समझाएं?

जब इंटरव्यूअर पूछे: *"आपने MongoDB क्यों चुना और Mongoose का उपयोग कैसे किया?"*

#### 1. Why MongoDB? (NoSQL का चुनाव क्यों?)
* *"फूड बिजनेस में मेनू आइटम्स और बैचेस काफी डायनेमिक होते हैं (अलग-अलग क्युजीन, टाइम स्लॉट्स, एलर्जी की लिस्ट)। MongoDB एक Document-based NoSQL डेटाबेस है जो JSON-लाइक BSON फॉर्मेट में डेटा स्टोर करता है। यह हाई रीड/राइट परफॉर्मेंस और फ्लेक्सिबल स्कीमा प्रदान करता है।"*

#### 2. Mongoose ODM का रोल
* *"MongoDB स्कीमा-लेस होता है, लेकिन प्रोडक्शन ऐप में नियमों की ज़रूरत होती है। Mongoose हमें स्ट्रिक्ट स्कीमा, डेटा टाइप्स, रिक्वायर्ड फील्ड्स, डीफॉल्ट वैल्यूज और रिलेशनशिप्स बनाने की ताकत देता है।"*

#### 3. 5 Collections और उनके Relationships
```
[User] (Customer/Owner)
   │
   ▼ (Owner owns)
[Business] (Kitchen Info)
   │
   ▼ (Kitchen has many)
[Product] (Recipe/Menu)
   │
   ▼ (Product is cooked in)
[Batch] (Schedule, Date, Stock, Deadline)
   │
   ▼ (Ordered in)
[Order] ◄── [User] (Customer who bought)
```
* *"रिलेशनशिप्स के लिए मैंने `mongoose.Schema.Types.ObjectId` और `ref` का इस्तेमाल किया है। जैसे `Batch` टेबल में `product` और `business` की आईडी होती है। जब हम `.populate('product')` करते हैं, तो Mongoose NoSQL में भी SQL के `JOIN` जैसा रिजल्ट दे देता है।"*

#### 4. Concurrency & Atomic Operations ($inc) — ⭐ सबसे इम्प्रेसिव पॉइंट!
> 💡 **यह इंटरव्यूअर को ज़रूर बताएं, वे बहुत इम्प्रेस होंगे:**
>
> *"सर, बैच-बेस्ड सिस्टम में सबसे बड़ा रिस्क यह होता है कि अगर बैच में सिर्फ 1 प्लेट बची है और 2 ग्राहक एक साथ 'Order' पर क्लिक कर दें, तो क्या होगा (Race Condition)?
> 
> इसे रोकने के लिए मैंने Mongoose का **Atomic `$inc` Operator** इस्तेमाल किया है:
> ```javascript
> await Batch.findByIdAndUpdate(batchId, {
>   $inc: { availableQuantity: -quantity, reservedQuantity: quantity }
> });
> ```
> बैकएंड पहले चेक करता है कि `availableQuantity >= item.quantity` है या नहीं। अगर स्टॉक है, तो एक ही एटॉमिक ऑपरेशन में स्टॉक घटता है और रिजर्व बढ़ता है। और अगर ग्राहक बाद में ऑर्डर कैंसिल करता है, तो `$inc` से स्टॉक तुरंत और सुरक्षित तरीके से वापस जुड़ जाता है।"*

---

### ❓ स्टेप 5: शीर्ष 10 इंटरव्यू प्रश्न और उनके सटीक उत्तर (Q&A Cheatsheet)

#### प्र. 1: "Why did you choose MERN Stack for BatchBite?"
> **उत्तर:** *"MERN स्टैक में पूरी एप्लिकेशन जावास्क्रिप्ट (Frontend में React और Backend में Node.js) पर आधारित होती है, जिससे कोड शेयरिंग और डेवलपमेंट स्पीड बहुत तेज़ हो जाती है। React कंपोनेंट-बेस्ड आर्किटेक्चर से फास्ट और इंटरेक्टिव UI देता है, Express लाइटवेट और फास्ट REST APIs बनाने में मदद करता है, और MongoDB का JSON-लाइक डॉक्यूमेंट मॉडल जावास्क्रिप्ट ऑब्जेक्ट्स के साथ 100% नेचुरल तरीके से फिट बैठता है।"*

#### प्र. 2: "How does JWT Authentication work in your project?"
> **उत्तर:**
> 1. यूजर ईमेल और पासवर्ड सबमिट करता है।
> 2. बैकएंड पासवर्ड को Bcrypt से चेक करता है।
> 3. सही होने पर सर्वर एक JWT टोकन (पेयलोड में `userId` और `role` के साथ) जनरेट करके भेजता है।
> 4. फ्रंटएंड इस टोकन को `localStorage` में सेव करता है।
> 5. इसके बाद जब भी यूजर कोई प्राइवेट एक्शन करता है (जैसे ऑर्डर प्लेस करना), तो Axios Request Interceptor अपने आप हेडर में `Authorization: Bearer <token>` जोड़ता है।
> 6. बैकएंड मिडलवेयर `jwt.verify()` से टोकन डिकोड करके यूजर की पहचान करता है।

#### प्र. 3: "How do you protect routes on the frontend?"
> **उत्तर:** *"मैंने Higher-Order Component स्टाइल में `<ProtectedRoute>` और `<OwnerRoute>` कंपोनेंट्स बनाए हैं। ये React Router DOM के `<Outlet />` या बच्चों को तभी रेंडर करते हैं जब `useAuth()` में यूजर ऑथेंटिकेटेड हो। अगर यूजर लॉग इन नहीं है, तो `<Navigate to="/login" replace />` उसे लॉगिन पेज पर भेज देता है।"*

#### प्र. 4: "Why did you calculate order total on the backend instead of frontend?"
> **उत्तर:** *"सिक्योरिटी के लिए! फ्रंटएंड क्लाइंट के ब्राउज़र में रन होता है और उसे कोई भी यूजर Chrome DevTools या नेटवर्क इंटरसेप्टर से बदल सकता है। अगर हम फ्रंटएंड से भेजी गई टोटल प्राइस मान लें, तो कोई ₹500 की डिश को ₹1 भेजकर ऑर्डर कर सकता है। इसलिए हम सिर्फ `batchId` और `quantity` स्वीकार करते हैं, और प्राइस सीधे डेटाबेस के रिकॉर्ड से निकालकर सर्वर पर टोटल कैलकुलेट करते हैं।"*

#### प्र. 5: "What is an Axios Interceptor and why did you use it?"
> **उत्तर:** *"Axios Interceptor एक मिडलवेयर की तरह होता है जो हर HTTP रिक्वेस्ट जाने से पहले या रिस्पॉन्स आने के बाद उसे इंटरसेप्ट (पकड़) कर सकता है। मैंने Request Interceptor का इस्तेमाल हर API कॉल में JWT टोकन ऑटोमैटिक जोड़ने के लिए किया, और Response Interceptor का इस्तेमाल 401 Unauthorized एरर पर सेशन एक्सपायर हैंडल करने के लिए किया।"*

#### प्र. 6: "What is the difference between SQL JOIN and Mongoose `.populate()`?"
> **उत्तर:** *"SQL में `JOIN` डेटाबेस लेवल पर दो या अधिक टेबल्स को एक सिंगल क्वेरी में मर्ज करता है। MongoDB में Mongoose का `.populate()` एक कलेक्शन के `ObjectId` रेफरेंस का इस्तेमाल करके पीछे से दूसरी क्वेरी चलाता है और संबंधित डॉक्यूमेंट का डेटा लाकर हमारे ऑब्जेक्ट में अटैच कर देता है। रिजल्ट एक जैसा दिखता है, लेकिन NoSQL में यह एप्लिकेशन लेवल पर लिंक होता है।"*

#### प्र. 7: "What happens when an order is cancelled? How is stock restored?"
> **उत्तर:** *"जब कस्टमर या ओनर ऑर्डर कैंसिल या रिजेक्ट करता है, तो बैकएंड पहले ऑर्डर का करंट स्टेटस चेक करता है (सिर्फ Pending या Confirmed ऑर्डर ही कैंसिल हो सकते हैं, Preparing शुरू होने के बाद नहीं)। फिर बैकएंड ऑर्डर में मौजूद सभी आइटम्स के लिए `Batch.findByIdAndUpdate` चलाकर `$inc: { availableQuantity: +qty, reservedQuantity: -qty }` से स्टॉक को तुरंत रीस्टोर कर देता है।"*

#### प्र. 8: "How did you handle file uploads for dishes and business logo?"
> **उत्तर:** *"मैंने `multer` लाइब्रेरी का इस्तेमाल किया है। यह एक multipart/form-data मिडलवेयर है जो अपलोडेड फोटो को `Server/uploads/` डायरेक्टरी में यूनिक टाइमस्टैम्प नाम के साथ सेव करता है। फिर डेटाबेस में हम उस फाइल का रिलेटिव पाथ सेव करते हैं, और Express में `app.use('/uploads', express.static(...))` के जरिए फोटो को पब्लिकली सर्व करते हैं।"*

#### प्र. 9: "What was the most challenging bug you encountered and how did you resolve it?" (⭐ बहुत पसंदीदा सवाल!)
> **उत्तर:** 
> *"सर, प्रोजेक्ट के दौरान हमारे सामने दो बड़े टेक्निकल चैलेंजेस आए थे:*
> 1. **Port Collision (React vs Express)**: शुरुआत में रूट `.env` में `PORT=5000` लिखा हुआ था। जब हमने `npm start` किया, तो Create React App ने भी पोर्ट 5000 ले लिया और Express सर्वर भी 5000 पर था! इससे दोनों में पोर्ट कॉन्फ्लिक्ट हुआ और 'Network Error' आ रही थी। हमने रूट `.env` को `PORT=3000` और बैकएंड को `5000` पर अलग-अलग फिक्स करके CORS को प्रॉपर्ली कॉन्फ़िगर किया, जिससे एरर पूरी तरह हल हो गई।
> 2. **API Response Unnesting**: बैकएंड से डेटा `{ success: true, data: { batch: { ... } } }` फॉर्मेट में आ रहा था, जबकि फ्रंटएंड सीधे `res.data.batch` पढ़ रहा था जिससे डिश का नाम और फोटो `undefined` आ रही थी। हमने कोड को `res.data.data?.batch || res.data.batch` में नॉर्मलाइज किया जिससे सारा डेटा सही आने लगा।"*

#### प्र. 10: "If you had 2 weeks more, what features would you add to scale this app?"
> **उत्तर:**
> 1. *"पेमेंट गेटवे: Razorpay या Stripe का इंटीग्रेशन ताकि ऑनलाइन UPI और कार्ड पेमेंट हो सके।"*
> 2. *"WebSockets (Socket.io): रियल-टाइम लाइव नोटिफिकेशन, ताकि जैसे ही शेफ स्टेटस 'Preparing' से 'Ready' करे, ग्राहक के फोन पर बिना रिफ्रेश किए तुरंत नोटिफिकेशन आ जाए।"*
> 3. *"Redis Caching: होम पेज की एक्टिव बैचेस को Redis कैश में रखना ताकि डेटाबेस पर बार-बार लोड न पड़े।"*
> 4. *"SMS/WhatsApp Alert: Twilio API से ऑर्डर कन्फर्मेशन का WhatsApp मैसेज भेजना।"*

---

### 📝 संक्षेप में (Interview Quick Checklist):

जब भी आप बैठें, अपने दिमाग में यह 4-स्टेप फॉर्मूला याद रखें:
1. **Problem Statement**: होम शेफ्स का बैच-बेस्ड कुकिंग सिस्टम।
2. **Frontend Architecture**: React + Redux + Router + Axios Interceptors + Protected Routes।
3. **Backend Architecture**: Node.js + Express + MVC + JWT Auth + Server-Side Validation + Multer।
4. **Database Architecture**: MongoDB + Mongoose + 5 Collections + Population + Atomic Stock Update (`$inc`)।

