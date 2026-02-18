import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SyncRequest {
  accountId: string;
}

interface MockTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
}

// Generate mock transactions for demo purposes
function generateMockTransactions(): MockTransaction[] {
  const today = new Date();
  const transactions: MockTransaction[] = [];

  const mockData = [
    { description: "Salary Deposit", amount: 3500, type: "income" as const, category: "Salary" },
    { description: "Starbucks", amount: -6.50, type: "expense" as const, category: "Food" },
    { description: "Target", amount: -45.23, type: "expense" as const, category: "Shopping" },
    { description: "Spotify", amount: -12.99, type: "expense" as const, category: "Subscriptions" },
    { description: "Shell Gas Station", amount: -52.00, type: "expense" as const, category: "Transport" },
    { description: "Trader Joe's", amount: -67.89, type: "expense" as const, category: "Food" },
    { description: "Uber", amount: -24.50, type: "expense" as const, category: "Transport" },
    { description: "Amazon Prime", amount: -14.99, type: "expense" as const, category: "Subscriptions" },
    { description: "Gym Membership", amount: -50.00, type: "expense" as const, category: "Health" },
    { description: "Netflix", amount: -15.99, type: "expense" as const, category: "Subscriptions" },
  ];

  mockData.forEach((mock, idx) => {
    const date = new Date(today);
    date.setDate(date.getDate() - idx);

    transactions.push({
      id: `bank_${Date.now()}_${idx}`,
      date: date.toISOString().split("T")[0],
      description: mock.description,
      amount: mock.amount,
      category: mock.category,
      type: mock.type,
    });
  });

  return transactions;
}

async function syncBankTransactions(
  supabaseClient: ReturnType<typeof createClient>,
  userId: string,
  accountId: string
) {
  try {
    // Get bank account details
    const { data: account, error: accountError } = await supabaseClient
      .from("bank_accounts")
      .select("*")
      .eq("id", accountId)
      .eq("user_id", userId)
      .single();

    if (accountError || !account) {
      throw new Error("Bank account not found");
    }

    // In production, you would call Plaid API here
    // For demo, we generate mock transactions
    const bankTransactions = generateMockTransactions();

    // Import transactions into database
    const transactionsToInsert = bankTransactions.map((tx) => ({
      user_id: userId,
      amount: tx.amount,
      type: tx.type,
      description: tx.description,
      category: tx.category,
      date: tx.date,
      synced_from_bank: true,
      bank_transaction_id: tx.id,
    }));

    // Check for duplicates and insert only new ones
    const { data: existingIds } = await supabaseClient
      .from("transactions")
      .select("bank_transaction_id")
      .eq("user_id", userId)
      .in("bank_transaction_id", bankTransactions.map((t) => t.id));

    const existingIdSet = new Set(existingIds?.map((t: any) => t.bank_transaction_id) || []);

    const newTransactions = transactionsToInsert.filter(
      (t) => !existingIdSet.has(t.bank_transaction_id)
    );

    if (newTransactions.length > 0) {
      const { error: insertError } = await supabaseClient
        .from("transactions")
        .insert(newTransactions);

      if (insertError) throw insertError;
    }

    // Update last_synced timestamp
    const { error: updateError } = await supabaseClient
      .from("bank_accounts")
      .update({
        last_synced: new Date().toISOString(),
        sync_error: null,
      })
      .eq("id", accountId);

    if (updateError) throw updateError;

    return {
      success: true,
      message: `Successfully synced ${newTransactions.length} new transactions`,
      transactionCount: newTransactions.length,
    };
  } catch (error) {
    // Update sync error
    await supabaseClient
      .from("bank_accounts")
      .update({
        sync_error: error instanceof Error ? error.message : "Unknown error",
      })
      .eq("id", accountId);

    throw error;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Verify token and get user
    const { data, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !data.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { accountId } = (await req.json()) as SyncRequest;

    if (!accountId) {
      return new Response(JSON.stringify({ error: "Missing accountId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await syncBankTransactions(supabaseClient, data.user.id, accountId);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
