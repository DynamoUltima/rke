import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export type Agent = {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  properties: number;
  sales: string;
  rating: number;
  status: string;
  avatar: string;
};

type AgentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: Agent | null;
  onSave: (agent: Agent) => void;
  mode: "add" | "edit";
};

export function AgentDialog({
  open,
  onOpenChange,
  agent,
  onSave,
  mode,
}: AgentDialogProps) {
  const [formData, setFormData] = useState<Partial<Agent>>({
    name: "",
    email: "",
    phone: "",
    location: "",
    properties: 0,
    sales: "$0",
    rating: 4.5,
    status: "Active",
    avatar: "",
  });

  useEffect(() => {
    if (agent && mode === "edit") {
      setFormData(agent);
    } else if (mode === "add") {
      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        properties: 0,
        sales: "$0",
        rating: 4.5,
        status: "Active",
        avatar: "",
      });
    }
  }, [agent, mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      id: agent?.id || Date.now(),
      name: formData.name || "",
      email: formData.email || "",
      phone: formData.phone || "",
      location: formData.location || "",
      properties: formData.properties || 0,
      sales: formData.sales || "$0",
      rating: formData.rating || 4.5,
      status: formData.status || "Active",
      avatar: formData.avatar || "",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Agent" : "Edit Agent"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Smith"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john@homespace.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Miami, FL"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Away">Away</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="properties">Active Properties</Label>
              <Input
                id="properties"
                type="number"
                value={formData.properties || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    properties: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sales">Total Sales</Label>
              <Input
                id="sales"
                value={formData.sales}
                onChange={(e) =>
                  setFormData({ ...formData, sales: e.target.value })
                }
                placeholder="$0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rating: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="4.5"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {mode === "add" ? "Add Agent" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
