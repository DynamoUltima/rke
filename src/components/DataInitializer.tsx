import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { initializeSampleData } from "../utils/api";

export function DataInitializer() {
  const [hasData, setHasData] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkForData();
  }, []);

  async function checkForData() {
    try {
      const response = await fetch(
        `https://${(await import("../utils/supabase/info")).projectId}.supabase.co/functions/v1/make-server-20229b90/properties`,
        {
          headers: {
            Authorization: `Bearer ${(await import("../utils/supabase/info")).publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      setHasData(data.data && data.data.length > 0);
    } catch (error) {
      setHasData(false);
    }
  }

  async function handleInitialize() {
    setLoading(true);
    try {
      await initializeSampleData();
      setHasData(true);
      window.location.reload();
    } catch (error) {
      console.error("Failed to initialize data:", error);
      alert("Failed to initialize data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (hasData === null) {
    return null;
  }

  if (hasData) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Welcome to HomeSpace Admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            It looks like this is your first time using the system. Would you like to
            initialize it with sample data to get started?
          </p>
          <Button
            onClick={handleInitialize}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Initializing..." : "Initialize Sample Data"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
