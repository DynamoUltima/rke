import { Hono } from "npm:hono@4";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Middleware
app.use("*", cors());
app.use("*", logger(console.log));

// Supabase client for auth
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

// Helper function to generate unique IDs
const generateId = () => Date.now();

// Helper function to verify authentication
async function verifyAuth(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return { authorized: false, userId: null };
  }
  
  const accessToken = authHeader.split(" ")[1];
  if (!accessToken || accessToken === supabaseAnonKey) {
    return { authorized: false, userId: null };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return { authorized: false, userId: null };
    }
    
    return { authorized: true, userId: user.id, user };
  } catch (error) {
    console.log("Auth verification error:", error);
    return { authorized: false, userId: null };
  }
}

// ============== AUTH ENDPOINTS ==============

// Signup endpoint
app.post("/make-server-20229b90/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return c.json({ success: false, error: "Email and password are required" }, 400);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || "" },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.log("Signup error:", error);
      return c.json({ success: false, error: error.message }, 400);
    }

    return c.json({ success: true, data: { user: data.user } });
  } catch (error) {
    console.log("Error during signup:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============== PROPERTIES ENDPOINTS ==============

// Get all properties
app.get("/make-server-20229b90/properties", async (c) => {
  try {
    const properties = await kv.getByPrefix("property:");
    return c.json({ success: true, data: properties });
  } catch (error) {
    console.log("Error fetching properties:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get single property
app.get("/make-server-20229b90/properties/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const property = await kv.get(`property:${id}`);
    if (!property) {
      return c.json({ success: false, error: "Property not found" }, 404);
    }
    return c.json({ success: true, data: property });
  } catch (error) {
    console.log("Error fetching property:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create property
app.post("/make-server-20229b90/properties", async (c) => {
  try {
    const body = await c.req.json();
    const id = body.id || generateId();
    const property = { ...body, id };
    await kv.set(`property:${id}`, property);
    return c.json({ success: true, data: property });
  } catch (error) {
    console.log("Error creating property:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update property
app.put("/make-server-20229b90/properties/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const property = { ...body, id };
    await kv.set(`property:${id}`, property);
    return c.json({ success: true, data: property });
  } catch (error) {
    console.log("Error updating property:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete property
app.delete("/make-server-20229b90/properties/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`property:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting property:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============== AGENTS ENDPOINTS ==============

// Get all agents
app.get("/make-server-20229b90/agents", async (c) => {
  try {
    const agents = await kv.getByPrefix("agent:");
    return c.json({ success: true, data: agents });
  } catch (error) {
    console.log("Error fetching agents:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create agent
app.post("/make-server-20229b90/agents", async (c) => {
  try {
    const body = await c.req.json();
    const id = body.id || generateId();
    const agent = { ...body, id };
    await kv.set(`agent:${id}`, agent);
    return c.json({ success: true, data: agent });
  } catch (error) {
    console.log("Error creating agent:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update agent
app.put("/make-server-20229b90/agents/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const agent = { ...body, id };
    await kv.set(`agent:${id}`, agent);
    return c.json({ success: true, data: agent });
  } catch (error) {
    console.log("Error updating agent:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete agent
app.delete("/make-server-20229b90/agents/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`agent:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting agent:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============== CLIENTS ENDPOINTS ==============

// Get all clients
app.get("/make-server-20229b90/clients", async (c) => {
  try {
    const clients = await kv.getByPrefix("client:");
    return c.json({ success: true, data: clients });
  } catch (error) {
    console.log("Error fetching clients:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create client
app.post("/make-server-20229b90/clients", async (c) => {
  try {
    const body = await c.req.json();
    const id = body.id || generateId();
    const client = { ...body, id };
    await kv.set(`client:${id}`, client);
    return c.json({ success: true, data: client });
  } catch (error) {
    console.log("Error creating client:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update client
app.put("/make-server-20229b90/clients/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const client = { ...body, id };
    await kv.set(`client:${id}`, client);
    return c.json({ success: true, data: client });
  } catch (error) {
    console.log("Error updating client:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete client
app.delete("/make-server-20229b90/clients/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`client:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting client:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============== TRANSACTIONS ENDPOINTS ==============

// Get all transactions
app.get("/make-server-20229b90/transactions", async (c) => {
  try {
    const transactions = await kv.getByPrefix("transaction:");
    return c.json({ success: true, data: transactions });
  } catch (error) {
    console.log("Error fetching transactions:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create transaction
app.post("/make-server-20229b90/transactions", async (c) => {
  try {
    const body = await c.req.json();
    const id = body.id || `TXN-${generateId()}`;
    const transaction = { ...body, id };
    await kv.set(`transaction:${id}`, transaction);
    return c.json({ success: true, data: transaction });
  } catch (error) {
    console.log("Error creating transaction:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Initialize sample data
app.post("/make-server-20229b90/init-data", async (c) => {
  try {
    // Sample properties
    const sampleProperties = [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&h=100&fit=crop",
        name: "Ocean View Apartment",
        location: "Miami Beach, FL",
        status: "Available",
        price: "$850,000",
        priceNum: 850000,
        agent: "Sarah Johnson",
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=100&h=100&fit=crop",
        name: "Downtown Condo",
        location: "New York, NY",
        status: "Sold",
        price: "$1,200,000",
        priceNum: 1200000,
        agent: "Mike Chen",
      },
    ];

    // Sample agents
    const sampleAgents = [
      {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah.j@homespace.com",
        phone: "+1 (555) 123-4567",
        location: "Miami, FL",
        properties: 28,
        sales: "$3.2M",
        rating: 4.9,
        status: "Active",
        avatar: "",
      },
      {
        id: 2,
        name: "Mike Chen",
        email: "mike.c@homespace.com",
        phone: "+1 (555) 234-5678",
        location: "New York, NY",
        properties: 24,
        sales: "$2.8M",
        rating: 4.8,
        status: "Active",
        avatar: "",
      },
    ];

    // Sample clients
    const sampleClients = [
      {
        id: 1,
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1 (555) 111-2222",
        type: "Buyer",
        assignedAgent: "Sarah Johnson",
        properties: 2,
        status: "Active",
        avatar: "",
      },
    ];

    // Save to database
    for (const property of sampleProperties) {
      await kv.set(`property:${property.id}`, property);
    }
    for (const agent of sampleAgents) {
      await kv.set(`agent:${agent.id}`, agent);
    }
    for (const client of sampleClients) {
      await kv.set(`client:${client.id}`, client);
    }

    return c.json({ success: true, message: "Sample data initialized" });
  } catch (error) {
    console.log("Error initializing data:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Health check
app.get("/make-server-20229b90/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);
