import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { FoodItem, User, OrderItem, DeliveryAddress } from "../types";

interface StoreContextType {
  food_list: FoodItem[];
  cartItems: Record<string, number>;
  token: string;
  user: User | null;
  view: "store" | "admin";
  adminSubView: "add" | "list" | "orders";
  customerSubView: "home" | "cart" | "order" | "my-orders" | "verify";
  showLogin: boolean;
  alert: { message: string; type: "success" | "error" | "info" } | null;
  loading: boolean;
  orderToVerify: { orderId: string; success: string } | null;
  setView: (view: "store" | "admin") => void;
  setAdminSubView: (subView: "add" | "list" | "orders") => void;
  setCustomerSubView: (subView: "home" | "cart" | "order" | "my-orders" | "verify") => void;
  setShowLogin: (show: boolean) => void;
  setOrderToVerify: (data: { orderId: string; success: string } | null) => void;
  triggerAlert: (message: string, type?: "success" | "error" | "info") => void;
  
  // API actions
  fetchFoodList: () => Promise<void>;
  addToCart: (itemId: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
  loginUser: (email: string, passwordHash: string) => Promise<boolean>;
  loginWithGoogle: (credential: string) => Promise<boolean>;
  registerUser: (name: string, email: string, passwordHash: string) => Promise<boolean>;
  logout: () => void;
  placeNewOrder: (address: DeliveryAddress) => Promise<string | null>;
  verifyPayment: (orderId: string, success: boolean | string) => Promise<boolean>;
  fetchUserOrders: () => Promise<OrderItem[]>;
  fetchAllOrders: () => Promise<OrderItem[]>;
  updateOrderStatus: (orderId: string, status: string) => Promise<boolean>;
  deleteFoodItem: (id: string) => Promise<boolean>;
  addNewFoodItem: (food: Omit<FoodItem, "_id"> & { image?: string }) => Promise<boolean>;
  generateFoodDetails: (name: string, categoryHint?: string) => Promise<{
    name: string;
    description: string;
    category: string;
    suggestedPrice: number;
  } | null>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreContextProvider");
  }
  return context;
}

export function StoreContextProvider({ children }: { children: ReactNode }) {
  const [food_list, setFoodList] = useState<FoodItem[]>([]);
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  
  // Custom SPA Router state
  const [view, setView] = useState<"store" | "admin">("store");
  const [adminSubView, setAdminSubView] = useState<"add" | "list" | "orders">("list");
  const [customerSubView, setCustomerSubView] = useState<"home" | "cart" | "order" | "my-orders" | "verify">("home");
  const [orderToVerify, setOrderToVerify] = useState<{ orderId: string; success: string } | null>(null);

  // Modal and Alert trigger states
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Trigger alert helper
  const triggerAlert = (message: string, type: "success" | "error" | "info" = "info") => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 4500);
  };

  const clearSession = () => {
    setToken("");
    setUser(null);
    setCartItems({});
    localStorage.removeItem("foodie_token");
    localStorage.removeItem("foodie_user");
    setView("store");
    setCustomerSubView("home");
  };

  const handleAuthFailure = (response: Response): boolean => {
    if (response.status === 401) {
      clearSession();
      setShowLogin(true);
      triggerAlert("Session expired. Please sign in again.", "error");
      return true;
    }
    return false;
  };

  const validateSession = async (savedToken: string) => {
    try {
      const response = await fetch("/api/user/me", {
        headers: { token: savedToken }
      });
      const result = await response.json();
      if (result.success) {
        setToken(savedToken);
        setUser(result.user);
        localStorage.setItem("foodie_user", JSON.stringify(result.user));
      } else {
        clearSession();
      }
    } catch {
      clearSession();
    }
  };

  // Sync state with localStorage on startup
  useEffect(() => {
    const savedToken = localStorage.getItem("foodie_token");
    fetchFoodList();
    if (savedToken) {
      validateSession(savedToken);
    }
  }, []);

  // Fetch Cart Details whenever token changes
  useEffect(() => {
    if (token) {
      fetchCartData();
    } else {
      setCartItems({});
    }
  }, [token]);

  // Read backend list of food products
  const fetchFoodList = async () => {
    try {
      const response = await fetch("/api/food/list");
      const result = await response.json();
      if (result.success) {
        setFoodList(result.data);
      } else {
        triggerAlert(result.message || "Failed to load product list", "error");
      }
    } catch (err) {
      console.error(err);
      triggerAlert("Server communication error while fetching items", "error");
    }
  };

  // Fetch authenticated cart items
  const fetchCartData = async () => {
    if (!token) return;
    try {
      const response = await fetch("/api/cart/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token
        },
        body: JSON.stringify({})
      });
      const result = await response.json();
      if (handleAuthFailure(response)) return;
      if (result.success) {
        setCartItems(result.cartData || {});
      }
    } catch (err) {
      console.error("Cart retrieval error:", err);
    }
  };

  // Synchronized adding action
  const addToCart = async (itemId: string) => {
    // Optimistic UI updates
    setCartItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));

    if (token) {
      try {
        const response = await fetch("/api/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token
          },
          body: JSON.stringify({ itemId })
        });
        const result = await response.json();
        if (handleAuthFailure(response)) {
          setCartItems(prev => {
            const copy = { ...prev };
            if (copy[itemId] <= 1) delete copy[itemId];
            else copy[itemId] -= 1;
            return copy;
          });
          return;
        }
        if (!result.success) {
          triggerAlert(result.message || "Failed to synchronize cart item", "error");
          // Revert optimistic change
          setCartItems(prev => {
            const copy = { ...prev };
            if (copy[itemId] <= 1) delete copy[itemId];
            else copy[itemId] -= 1;
            return copy;
          });
        }
      } catch (err) {
        triggerAlert("Error syncing cart addition to backend", "error");
      }
    } else {
      triggerAlert("Item added locally. Sign in to synchronize with your profile!", "info");
    }
  };

  // Synchronized removing action
  const removeFromCart = async (itemId: string) => {
    if (!cartItems[itemId]) return;

    // Optimistic UI updates
    setCartItems(prev => {
      const copy = { ...prev };
      if (copy[itemId] <= 1) delete copy[itemId];
      else copy[itemId] -= 1;
      return copy;
    });

    if (token) {
      try {
        const response = await fetch("/api/cart/remove", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token
          },
          body: JSON.stringify({ itemId })
        });
        const result = await response.json();
        if (handleAuthFailure(response)) {
          setCartItems(prev => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1
          }));
          return;
        }
        if (!result.success) {
          // Revert on error
          setCartItems(prev => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1
          }));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Helper counting metrics
  const getCartTotal = () => {
    let total = 0;
    for (const itemId in cartItems) {
      const item = food_list.find(f => f._id === itemId);
      if (item) {
        total += item.price * cartItems[itemId];
      }
    }
    return total;
  };

  const getCartCount = () => {
    let count = 0;
    for (const itemId in cartItems) {
      count += cartItems[itemId];
    }
    return count;
  };

  // Auth: Log in
  const loginUser = async (email: string, passwordHash: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: passwordHash })
      });
      const result = await response.json();
      setLoading(false);
      
      if (result.success) {
        setToken(result.token);
        setUser(result.user);
        localStorage.setItem("foodie_token", result.token);
        localStorage.setItem("foodie_user", JSON.stringify(result.user));
        
        triggerAlert(`Welcome back, ${result.user.name}!`, "success");
        setShowLogin(false);
        
        // Auto-switch view if logged in as Admin to administrative context optionally
        if (result.user.role === "admin") {
          setView("admin");
          setAdminSubView("orders");
        }
        return true;
      } else {
        triggerAlert(result.message || "User authentication failed", "error");
        return false;
      }
    } catch (err) {
      setLoading(false);
      triggerAlert("Failed to reach login portal endpoint", "error");
      return false;
    }
  };

  const applyAuthSession = (result: { token: string; user: User; message?: string }) => {
    setToken(result.token);
    setUser(result.user);
    localStorage.setItem("foodie_token", result.token);
    localStorage.setItem("foodie_user", JSON.stringify(result.user));
    triggerAlert(result.message || `Welcome, ${result.user.name}!`, "success");
    setShowLogin(false);
    if (result.user.role === "admin") {
      setView("admin");
      setAdminSubView("orders");
    }
  };

  // Auth: Google Sign-In
  const loginWithGoogle = async (credential: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch("/api/user/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential })
      });
      const result = await response.json();
      setLoading(false);

      if (result.success) {
        applyAuthSession(result);
        return true;
      }
      triggerAlert(result.message || "Google sign-in failed", "error");
      return false;
    } catch (err) {
      setLoading(false);
      triggerAlert("Failed to reach Google sign-in endpoint", "error");
      return false;
    }
  };

  // Auth: Sign registration
  const registerUser = async (name: string, email: string, passwordHash: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: passwordHash })
      });
      const result = await response.json();
      setLoading(false);

      if (result.success) {
        setToken(result.token);
        setUser(result.user);
        localStorage.setItem("foodie_token", result.token);
        localStorage.setItem("foodie_user", JSON.stringify(result.user));
        
        triggerAlert(`Account registered successfully. Welcome, ${name}!`, "success");
        setShowLogin(false);
        return true;
      } else {
        triggerAlert(result.message || "Registration failed", "error");
        return false;
      }
    } catch (err) {
      setLoading(false);
      triggerAlert("Failed to reach registration gateway", "error");
      return false;
    }
  };

  // Auth: Log out
  const logout = () => {
    clearSession();
    triggerAlert("Logged out successfully", "info");
  };

  // Transaction: Place order
  const placeNewOrder = async (address: DeliveryAddress): Promise<string | null> => {
    if (!token) {
      triggerAlert("Please log in to place items checkout", "error");
      setShowLogin(true);
      return null;
    }

    setLoading(true);
    // Assemble cart list
    const orderItemsList = Object.entries(cartItems).map(([itemId, val]) => {
      const qty = Number(val);
      const food = food_list.find(f => f._id === itemId);
      return {
        foodId: itemId,
        name: food ? food.name : "Unknown Product",
        price: food ? food.price : 0,
        quantity: qty
      };
    }).filter(i => i.quantity > 0);

    const subtotal = getCartTotal();
    const deliveryFee = 5;
    const finalAmount = subtotal + deliveryFee;

    try {
      const response = await fetch("/api/order/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token
        },
        body: JSON.stringify({
          items: orderItemsList,
          amount: finalAmount,
          address
        })
      });
      const result = await response.json();
      setLoading(false);

      if (result.success && result.session_url) {
        // Empty local cart state
        setCartItems({});
        return result.session_url;
      } else {
        triggerAlert(result.message || "Failed to create order on server", "error");
        return null;
      }
    } catch (err) {
      setLoading(false);
      triggerAlert("Order processing timed out or failed to connect", "error");
      return null;
    }
  };

  // Transaction: Verify payment
  const verifyPayment = async (orderId: string, success: boolean | string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch("/api/order/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, success: String(success) })
      });
      const result = await response.json();
      setLoading(false);
      return !!result.success;
    } catch (err) {
      setLoading(false);
      console.error(err);
      return false;
    }
  };

  // Fetch client specific orders list
  const fetchUserOrders = async (): Promise<OrderItem[]> => {
    if (!token) return [];
    try {
      const response = await fetch("/api/order/userorders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token
        }
      });
      const result = await response.json();
      if (result.success) {
        return result.data || [];
      }
      return [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  // Admin Actions API
  const fetchAllOrders = async (): Promise<OrderItem[]> => {
    if (!token) return [];
    try {
      const response = await fetch("/api/order/list", {
        headers: { token }
      });
      const result = await response.json();
      if (result.success) {
        return result.data || [];
      }
      return [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const updateOrderStatus = async (orderId: string, status: string): Promise<boolean> => {
    if (!token) return false;
    try {
      const response = await fetch("/api/order/status", {
        method: "POST",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({ orderId, status })
      });
      const result = await response.json();
      if (result.success) {
        triggerAlert(`Order status updated to "${status}"`, "success");
        return true;
      } else {
        triggerAlert(result.message || "Failed to update delivery status", "error");
        return false;
      }
    } catch (err) {
      triggerAlert("Error communicating order update to server", "error");
      return false;
    }
  };

  const deleteFoodItem = async (id: string): Promise<boolean> => {
    if (!token) return false;
    try {
      const response = await fetch("/api/food/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({ id })
      });
      const result = await response.json();
      if (result.success) {
        triggerAlert("Food item deleted from database", "success");
        await fetchFoodList(); // Reload food display items
        return true;
      } else {
        triggerAlert(result.message || "Failed to delete item", "error");
        return false;
      }
    } catch (err) {
      triggerAlert("Error connecting to inventory database", "error");
      return false;
    }
  };

  const addNewFoodItem = async (food: Omit<FoodItem, "_id"> & { image?: string }): Promise<boolean> => {
    if (!token) return false;
    try {
      const response = await fetch("/api/food/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify(food)
      });
      const result = await response.json();
      if (result.success) {
        triggerAlert(`Added "${food.name}" to the dynamic catalog!`, "success");
        await fetchFoodList(); // Reload items list
        return true;
      } else {
        triggerAlert(result.message || "Failed to register new food item", "error");
        return false;
      }
    } catch (err) {
      triggerAlert("Server communication error adding food", "error");
      return false;
    }
  };

  const generateFoodDetails = async (name: string, categoryHint?: string) => {
    if (!token) {
      triggerAlert("Admin login required for AI generation", "error");
      return null;
    }
    try {
      const response = await fetch("/api/ai/generate-food-details", {
        method: "POST",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({ name, categoryHint })
      });
      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      triggerAlert(result.message || "AI generation failed", "error");
      return null;
    } catch (err) {
      triggerAlert("Could not reach AI service", "error");
      return null;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        food_list,
        cartItems,
        token,
        user,
        view,
        adminSubView,
        customerSubView,
        showLogin,
        alert,
        loading,
        orderToVerify,
        setView,
        setAdminSubView,
        setCustomerSubView,
        setShowLogin,
        setOrderToVerify,
        triggerAlert,
        fetchFoodList,
        addToCart,
        removeFromCart,
        getCartTotal,
        getCartCount,
        loginUser,
        loginWithGoogle,
        registerUser,
        logout,
        placeNewOrder,
        verifyPayment,
        fetchUserOrders,
        fetchAllOrders,
        updateOrderStatus,
        deleteFoodItem,
        addNewFoodItem,
        generateFoodDetails
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
