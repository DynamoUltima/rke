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
import { Textarea } from "./ui/textarea";

export type Property = {
  id: number;
  image: string;
  name: string;
  location: string;
  status: string;
  price: string;
  priceNum: number;
  agent: string;
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
};

type PropertyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: Property | null;
  onSave: (property: Property) => void;
  mode: "add" | "edit";
};

export function PropertyDialog({
  open,
  onOpenChange,
  property,
  onSave,
  mode,
}: PropertyDialogProps) {
  const [formData, setFormData] = useState<Partial<Property>>({
    name: "",
    location: "",
    status: "Available",
    price: "",
    agent: "",
    description: "",
    bedrooms: 0,
    bathrooms: 0,
    sqft: 0,
  });

  useEffect(() => {
    if (property && mode === "edit") {
      setFormData(property);
    } else if (mode === "add") {
      setFormData({
        name: "",
        location: "",
        status: "Available",
        price: "",
        agent: "",
        description: "",
        bedrooms: 0,
        bathrooms: 0,
        sqft: 0,
      });
    }
  }, [property, mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const priceNum = parseFloat(formData.price?.replace(/[$,]/g, "") || "0");
    
    onSave({
      id: property?.id || Date.now(),
      image: property?.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&h=100&fit=crop",
      name: formData.name || "",
      location: formData.location || "",
      status: formData.status || "Available",
      price: formData.price || "",
      priceNum: priceNum,
      agent: formData.agent || "",
      description: formData.description,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      sqft: formData.sqft,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Property" : "Edit Property"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Property Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ocean View Apartment"
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
                placeholder="Miami Beach, FL"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="$850,000"
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
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Sold">Sold</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agent">Assigned Agent</Label>
              <Select
                value={formData.agent}
                onValueChange={(value) =>
                  setFormData({ ...formData, agent: value })
                }
              >
                <SelectTrigger id="agent">
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                  <SelectItem value="Emma Davis">Emma Davis</SelectItem>
                  <SelectItem value="James Wilson">James Wilson</SelectItem>
                  <SelectItem value="Lisa Anderson">Lisa Anderson</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })
                }
                placeholder="3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 0 })
                }
                placeholder="2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sqft">Square Feet</Label>
              <Input
                id="sqft"
                type="number"
                value={formData.sqft || ""}
                onChange={(e) =>
                  setFormData({ ...formData, sqft: parseInt(e.target.value) || 0 })
                }
                placeholder="1500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter property description..."
              rows={4}
            />
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
              {mode === "add" ? "Add Property" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
