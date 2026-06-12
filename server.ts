import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { FoodItem, OrderItem, User, OrderStatus } from "./src/types";

// Setup database paths
const DB_FILE = path.join(process.cwd(), "db.json");

// Define initial food list
const INITIAL_FOOD_ITEMS: FoodItem[] = [
  {
    _id: "food_1",
    name: "Greek Salad",
    description: "Crisp cucumber, ripe tomatoes, olives, Feta cheese, tossed in extra virgin olive oil.",
    price: 12,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60",
    category: "Salad"
  },
  {
    _id: "food_2",
    name: "Vegan Garden Salad",
    description: "Leafy greens, baby spinach, vibrant carrots, radishes, and lemon vinaigrette.",
    price: 10,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60",
    category: "Salad"
  },
  {
    _id: "food_3",
    name: "Spring Rolls",
    description: "Crisp wrapper bursting with fresh sautéed vegetables, served with sweet chili sauce.",
    price: 14,
    image: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=500&auto=format&fit=crop&q=60",
    category: "Rolls"
  },
  {
    _id: "food_4",
    name: "Paneer Shawarma Wrap",
    description: "Soft flatbread wrapped around marinated grilled paneer, onions, peppers, and green chutney.",
    price: 15,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60",
    category: "Rolls"
  },
  {
    _id: "food_5",
    name: "Glazed Chocolate Donut",
    description: "Light, fluffy raised donut dipped in a pure chocolate glaze.",
    price: 6,
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&auto=format&fit=crop&q=60",
    category: "Deserts"
  },
  {
    _id: "food_6",
    name: "Fruit Cream Parfait",
    description: "Creamy layered vanilla mouse topped with candied summer fruits.",
    price: 8,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60",
    category: "Deserts"
  },
  {
    _id: "food_7",
    name: "Gourmet Club Sandwich",
    description: "Double-decker whole wheat bread layered with lettuce, cheddar cheese, tomato, and garlic mayo.",
    price: 14,
    image: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=500&auto=format&fit=crop&q=60",
    category: "Sandwich"
  },
  {
    _id: "food_8",
    name: "Pesto Caprese Panini",
    description: "Toasted sourdough bread filled with fresh mozzarella, tomato, and fragrant green basil pesto.",
    price: 15,
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop&q=60",
    category: "Sandwich"
  },
  {
    _id: "food_9",
    name: "Chocolate Fudge Cake",
    description: "Rich, velvety multi-layer dark chocolate fudge cake with premium cocoa.",
    price: 18,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60",
    category: "Cake"
  },
  {
    _id: "food_10",
    name: "Red Velvet Bliss Slice",
    description: "Decadent crimson sponge layered with sweet vanilla bean cream cheese frosting.",
    price: 16,
    image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&auto=format&fit=crop&q=60",
    category: "Cake"
  },
  {
    _id: "food_11",
    name: "Quinoa Avocado Bowl",
    description: "Nutritious steam-cooked quinoa, fresh sliced avocado, roasted chickpeas, and sesame tahini drape.",
    price: 18,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60",
    category: "Pure Veg"
  },
  {
    _id: "food_12",
    name: "Mediterranean Hummus Platter",
    description: "Trio of herbal hummus, crispy green falafels, stuffed vine leaves, hot grilled pita, and olive dip.",
    price: 22,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60",
    category: "Pure Veg"
  },
  {
    _id: "food_112",
    name: "Creamy Basil Pasta",
    description: "Penne pasta folded in a creamy basil spinach sauce, dusted with aged Parmigiano.",
    price: 20,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60",
    category: "Pasta"
  },
  {
    _id: "food_13",
    name: "Spicy Arrabbiata Noodles",
    description: "Chili-infused tomato concassé tossed in tender noodles and fresh parsley garnish.",
    price: 19,
    image: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&auto=format&fit=crop&q=60",
    category: "Noodles"
  }
];

// In-Memory Database State loaded from DB_FILE or default
interface DbSchema {
  users: Array<{ id: string; name: string; email: string; passwordHash: string; cart: Record<string, number> }>;
  foods: FoodItem[];
  orders: OrderItem[];
}

let db: DbSchema = {
  users: [
    {
      id: "demo_user",
      name: "John Doe",
      email: "demo@foodie.com",
      passwordHash: "demo123",
      cart: { "food_1": 2, "food_5": 1 }
    }
  ],
  foods: INITIAL_FOOD_ITEMS,
  orders: [
    {
      _id: "order_1001",
      userId: "demo_user",
      items: [
        { foodId: "food_1", name: "Greek Salad", price: 12, quantity: 2 },
        { foodId: "food_5", name: "Glazed Chocolate Donut", price: 6, quantity: 1 }
      ],
      amount: 35, // 24 + 6 + 5 delivery
      address: {
        firstName: "John",
        lastName: "Doe",
        email: "demo@foodie.com",
        street: "456 Fresh Ave",
        city: "San Francisco",
        state: "CA",
        zipCode: "94111",
        country: "USA",
        phone: "415-555-1234"
      },
      status: "Out for Delivery",
      date: new Date(Date.now() - 3600000).toISOString(),
      payment: true
    }
  ]
};

// Functions to load and save states to db.json
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (parsed.users && parsed.foods && parsed.orders) {
        db = parsed;
        console.log("Database successfully loaded from", DB_FILE);
      }
    } else {
      saveDatabase();
    }
  } catch (err) {
    console.error("Error loading filesystem database, using in-memory:", err);
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving database to filesystem:", err);
  }
}

// Initialize database
loadDatabase();

const DEV_ADMIN_EMAIL = "admin@foodie.com";

function getAdminEmail(): string {
  const configured = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  if (configured) return configured;

  if (process.env.NODE_ENV !== "production") {
    return DEV_ADMIN_EMAIL;
  }

  return "";
}

function isAdminConfigured(): boolean {
  return getAdminEmail().length > 0;
}

function resolveUserRole(email: string): "admin" | "user" {
  const adminEmail = getAdminEmail();
  if (adminEmail && email.toLowerCase() === adminEmail) {
    return "admin";
  }
  return "user";
}

function ensureDevAdminUser() {
  if ((process.env.ADMIN_EMAIL || "").trim()) return;
  if (process.env.NODE_ENV === "production") return;

  const existing = db.users.find(u => u.email.toLowerCase() === DEV_ADMIN_EMAIL);
  if (!existing) {
    db.users.push({
      id: "dev_admin",
      name: "Dev Admin",
      email: DEV_ADMIN_EMAIL,
      passwordHash: "admin123",
      cart: {}
    });
    saveDatabase();
    console.warn(`[Foodie] ADMIN_EMAIL not set — dev admin available at ${DEV_ADMIN_EMAIL} / admin123`);
  }
}

ensureDevAdminUser();

// Cryptographic Simulation / Encode-Decode JWT values
function generateToken(userId: string, email: string, role: string = "user"): string {
  const payload = { userId, email, role, exp: Date.now() + 86400000 };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    if (!token) return null;
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const payload = JSON.parse(decoded);
    if (payload.exp && payload.exp < Date.now()) {
      return null; // Expired
    }
    return payload;
  } catch (e) {
    return null;
  }
}

// Token authorization middleware
const authMiddleware = (req: any, res: any, next: () => void) => {
  const token = req.headers.token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ success: false, message: "Not Authorized, Login Again" });
  }

  const verified = verifyToken(token as string);
  if (!verified || !verified.userId) {
    return res.status(401).json({ success: false, message: "Session expired or invalid token" });
  }

  const user = db.users.find(u => u.id === verified.userId);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Session expired. Please log in again."
    });
  }

  if (!req.body || typeof req.body !== "object") {
    req.body = {};
  }
  req.body.userId = user.id;
  req.user = verified;
  req.dbUser = user;
  next();
};

const adminMiddleware = (req: any, res: any, next: () => void) => {
  const token = req.headers.token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ success: false, message: "Not Authorized, Login Again" });
  }

  const verified = verifyToken(token as string);
  if (!verified) {
    return res.status(401).json({ success: false, message: "Session expired or invalid token" });
  }

  if (!isAdminConfigured()) {
    return res.status(503).json({
      success: false,
      message: "Admin not configured. Set the ADMIN_EMAIL environment variable."
    });
  }

  const user = db.users.find(u => u.id === verified.userId);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Session expired. Please log in again."
    });
  }

  if (resolveUserRole(user.email) !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access denied" });
  }

  if (!req.body || typeof req.body !== "object") {
    req.body = {};
  }
  req.body.userId = user.id;
  req.user = verified;
  req.dbUser = user;
  next();
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Use high limits to support raw base64 uploads for images gracefully
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Enable CORS manually (so we avoid installing additional npm cors modules and potential version lockups)
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, token, Authorization");
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    next();
  });

  // REST API DEFINITIONS
  
  // 1. User APIs
  app.get("/api/user/me", authMiddleware, (req: any, res) => {
    const user = req.dbUser;
    const role = resolveUserRole(user.email);
    return res.json({
      success: true,
      user: { _id: user.id, name: user.name, email: user.email, role }
    });
  });

  app.post("/api/user/register", (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide all details (name, email, password)" });
    }

    // Check if user exists
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    // Set role
    const role = resolveUserRole(email.toLowerCase());
    const newUser = {
      id: "u_" + Math.random().toString(36).substring(2, 11),
      name,
      email: email.toLowerCase(),
      passwordHash: password, // Simulated hash
      cart: {}
    };

    db.users.push(newUser);
    saveDatabase();

    const token = generateToken(newUser.id, newUser.email, role);
    return res.json({
      success: true,
      message: "Registration Successful",
      token,
      user: { _id: newUser.id, name: newUser.name, email: newUser.email, role }
    });
  });

  app.post("/api/user/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }

    // Password check
    if (user.passwordHash !== password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const role = resolveUserRole(user.email);
    const token = generateToken(user.id, user.email, role);
    return res.json({
      success: true,
      message: "Signed in successfully",
      token,
      user: { _id: user.id, name: user.name, email: user.email, role }
    });
  });

  // 2. Food Product APIs
  app.get("/api/food/list", (req, res) => {
    return res.json({ success: true, data: db.foods });
  });

  app.post("/api/food/add", adminMiddleware, (req, res) => {
    const { name, description, price, category, image } = req.body;
    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({ success: false, message: "Missing food fields (name, description, price, category)" });
    }

    // Simple auto image assignment if none or base64
    const finalImage = image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
    const newFood: FoodItem = {
      _id: "food_" + Math.random().toString(36).substring(2, 11),
      name,
      description,
      price: Number(price),
      category,
      image: finalImage
    };

    db.foods.push(newFood);
    saveDatabase();

    return res.json({ success: true, message: "Food Added Successfully", data: newFood });
  });

  app.post("/api/food/remove", adminMiddleware, (req, res) => {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: "Missing property 'id' to remove" });
    }

    const index = db.foods.findIndex(f => f._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    db.foods.splice(index, 1);
    saveDatabase();

    return res.json({ success: true, message: "Food Removed Successfully" });
  });

  // 3. Cart APIs (Authorized)
  app.post("/api/cart/add", authMiddleware, (req: any, res) => {
    const { itemId } = req.body;
    if (!itemId) {
      return res.status(400).json({ success: false, message: "Missing 'itemId'" });
    }

    const user = req.dbUser;

    if (!user.cart) {
      user.cart = {};
    }

    user.cart[itemId] = (user.cart[itemId] || 0) + 1;
    saveDatabase();

    return res.json({ success: true, message: "Added To Cart", cartData: user.cart });
  });

  app.post("/api/cart/remove", authMiddleware, (req: any, res) => {
    const { itemId } = req.body;
    if (!itemId) {
      return res.status(400).json({ success: false, message: "Missing 'itemId'" });
    }

    const user = req.dbUser;

    if (user.cart && user.cart[itemId] > 0) {
      user.cart[itemId] -= 1;
      if (user.cart[itemId] === 0) {
        delete user.cart[itemId];
      }
    }
    saveDatabase();

    return res.json({ success: true, message: "Removed From Cart", cartData: user.cart || {} });
  });

  app.post("/api/cart/get", authMiddleware, (req: any, res) => {
    const user = req.dbUser;
    return res.json({ success: true, cartData: user.cart || {} });
  });

  // 4. Order APIs
  app.post("/api/order/place", authMiddleware, (req: any, res) => {
    const { userId, items, amount, address } = req.body;
    if (!items || !amount || !address) {
      return res.status(400).json({ success: false, message: "Missing order fields (items, amount, address)" });
    }

    const user = req.dbUser;

    // Save order
    const orderId = "order_" + Math.random().toString(36).substring(2, 9).toUpperCase();
    const newOrder: OrderItem = {
      _id: orderId,
      userId: user.id,
      items,
      amount,
      address,
      status: "Food Processing",
      date: new Date().toISOString(),
      payment: false // Unpaid until verified
    };

    db.orders.push(newOrder);

    // Empty user's cart in the database now
    user.cart = {};
    
    saveDatabase();

    // Create a mock checkout session redirection URL inside our web app
    const session_url = `/verify?success=true&orderId=${orderId}`;
    return res.json({ success: true, session_url });
  });

  app.post("/api/order/verify", (req, res) => {
    const { success, orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: "Missing orderId" });
    }

    const orderIndex = db.orders.findIndex(o => o._id === orderId);
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (success === "true" || success === true) {
      db.orders[orderIndex].payment = true;
      saveDatabase();
      return res.json({ success: true, message: "Paid Successfully" });
    } else {
      // Payment failed, remove from list or keep unpaid
      db.orders.splice(orderIndex, 1);
      saveDatabase();
      return res.json({ success: false, message: "Payment Cancelled / Failed" });
    }
  });

  // Fetch client personal orders
  app.post("/api/order/userorders", authMiddleware, (req, res) => {
    const { userId } = req.body;
    const userOrders = db.orders.filter(o => o.userId === userId);
    return res.json({ success: true, data: userOrders });
  });

  // List all orders (Admin only API)
  app.get("/api/order/list", adminMiddleware, (req, res) => {
    // Return all orders
    return res.json({ success: true, data: db.orders });
  });

  // Alter food order delivery progress status
  app.post("/api/order/status", adminMiddleware, (req, res) => {
    const { orderId, status } = req.body;
    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "Missing 'orderId' or 'status'" });
    }

    const index = db.orders.findIndex(o => o._id === orderId);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    db.orders[index].status = status as OrderStatus;
    saveDatabase();

    return res.json({ success: true, message: "Status Updated Successfully", data: db.orders[index] });
  });

  // Public config for client-side Google APIs (keys are referrer-restricted in Google Cloud)
  app.get("/api/config/public", (_req, res) => {
    return res.json({
      success: true,
      googleClientId: process.env.GOOGLE_CLIENT_ID || "",
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || ""
    });
  });

  // Gemini AI: auto-generate food menu details for admin
  app.post("/api/ai/generate-food-details", adminMiddleware, async (req, res) => {
    const { name, categoryHint } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ success: false, message: "Please provide a food name or idea" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        success: false,
        message: "Gemini API key not configured. Add GEMINI_API_KEY to your environment."
      });
    }

    const categories = ["Salad", "Rolls", "Deserts", "Sandwich", "Cake", "Pure Veg", "Pasta", "Noodles"];
    const hint = categoryHint ? ` Prefer category: ${categoryHint}.` : "";

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You write menu copy for a food delivery app called Foodie.
Given this food item idea: "${name.trim()}"${hint}

Return ONLY a valid JSON object (no markdown, no code fences) with exactly these fields:
{
  "name": "polished product name",
  "description": "2-3 appetizing sentences mentioning key ingredients",
  "category": "one of: ${categories.join(", ")}",
  "suggestedPrice": number between 5 and 25 (USD, no currency symbol)
}`
      });

      const raw = (response.text || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
      const parsed = JSON.parse(raw);

      if (!parsed.description || !parsed.category) {
        return res.status(502).json({ success: false, message: "AI returned incomplete data. Try again." });
      }

      if (!categories.includes(parsed.category)) {
        parsed.category = categoryHint || "Salad";
      }

      return res.json({
        success: true,
        data: {
          name: parsed.name || name.trim(),
          description: parsed.description,
          category: parsed.category,
          suggestedPrice: Number(parsed.suggestedPrice) || 12
        }
      });
    } catch (err) {
      console.error("Gemini generate-food-details error:", err);
      return res.status(500).json({ success: false, message: "Failed to generate food details. Check your Gemini API key." });
    }
  });

  // Google Sign-In: verify ID token and login or register
  app.post("/api/user/google", async (req, res) => {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: "Missing Google credential" });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(503).json({
        success: false,
        message: "Google Sign-In not configured. Add GOOGLE_CLIENT_ID to your environment."
      });
    }

    try {
      const tokenRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
      if (!tokenRes.ok) {
        return res.status(401).json({ success: false, message: "Invalid Google token" });
      }

      const payload = await tokenRes.json() as {
        aud: string;
        email?: string;
        email_verified?: string;
        name?: string;
        sub?: string;
      };

      if (payload.aud !== clientId) {
        return res.status(401).json({ success: false, message: "Google token audience mismatch" });
      }

      if (!payload.email || payload.email_verified !== "true") {
        return res.status(401).json({ success: false, message: "Google account email not verified" });
      }

      const email = payload.email.toLowerCase();
      const displayName = payload.name || email.split("@")[0];
      const role = resolveUserRole(email);

      let user = db.users.find(u => u.email.toLowerCase() === email);
      if (!user) {
        user = {
          id: "u_" + Math.random().toString(36).substring(2, 11),
          name: displayName,
          email,
          passwordHash: `google:${payload.sub}`,
          cart: {}
        };
        db.users.push(user);
        saveDatabase();
      } else if (user.name !== displayName && displayName) {
        user.name = displayName;
        saveDatabase();
      }

      const token = generateToken(user.id, user.email, role);
      return res.json({
        success: true,
        message: "Signed in with Google",
        token,
        user: { _id: user.id, name: user.name, email: user.email, role }
      });
    } catch (err) {
      console.error("Google sign-in error:", err);
      return res.status(500).json({ success: false, message: "Google sign-in failed" });
    }
  });

  // Serve static assets and Vite server
  if (process.env.NODE_ENV !== "production") {
    console.log("Vite dev server integrating as middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production build static files...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!isAdminConfigured()) {
    console.error("[Foodie] ADMIN_EMAIL is not set — admin panel is disabled in production.");
  } else if (!(process.env.ADMIN_EMAIL || "").trim() && process.env.NODE_ENV !== "production") {
    console.warn(`[Foodie] ADMIN_EMAIL not set — using dev fallback ${DEV_ADMIN_EMAIL}`);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express application active on port ${PORT}`);
  });
}

startServer();
