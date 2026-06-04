import React, { useState } from "react";
import { TextField, Button } from "../vibes";
import { COLORS } from "../constants/colors";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

export function AddCategoryModal({ isOpen, onClose, onSubmit }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: COLORS.background.main,
    padding: "2rem",
    borderRadius: "0.5rem",
    width: "400px",
    maxWidth: "90vw",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "1rem",
  };

  const handleClose = () => {
    setName("");
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(name.trim());
      setName("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={overlayStyle} onClick={handleClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h2 style={{ marginTop: 0, marginBottom: "1rem", color: COLORS.text.primary }}>Add New Category</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Category Name"
            placeholder="e.g. Subscriptions"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={error || undefined}
            fullWidth
            required
            autoFocus
          />
          <div style={buttonGroupStyle}>
            <Button type="submit" variant="primary" disabled={isSubmitting} fullWidth>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
            <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
