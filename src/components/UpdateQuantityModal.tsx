import React, { useState } from 'react';

interface UpdateQuantityModalProps {
  onSubmit: (quantity: number) => void;
  onClose: () => void;
  materialName: string;
  action: 'decrease' | 'increase';
  maxQuantity?: number;
  currentQuantity?: number;
}

export function UpdateQuantityModal({
  onSubmit,
  onClose,
  materialName,
  action,
  maxQuantity,
  currentQuantity,
}: UpdateQuantityModalProps) {
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (action === 'decrease' && currentQuantity !== undefined && quantity > currentQuantity) {
      setError(`Cannot reduce more than the available quantity (${currentQuantity})`);
      return;
    }

    if (action === 'increase' && maxQuantity !== undefined && quantity > maxQuantity) {
      setError(`Cannot add more than the required quantity (${maxQuantity})`);
      return;
    }

    setError(null);
    onSubmit(quantity);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {action === 'decrease' ? 'Update Quantity Used' : 'Replenish Stock'} - {materialName}
        </h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {action === 'decrease' ? 'Quantity Used Today' : 'Quantity to Add'}
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                setQuantity(Number(e.target.value));
                setError(null);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
              min="0"
              max={action === 'decrease' ? currentQuantity : maxQuantity}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {action === 'decrease' ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}