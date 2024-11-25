import React from 'react';
import { Pencil, Trash2, MinusCircle, PlusCircle } from 'lucide-react';
import { Material } from '../types';

interface MaterialRowProps {
  material: Material;
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, action: 'decrease' | 'increase') => void;
}

export function MaterialRow({ material, onEdit, onDelete, onUpdate }: MaterialRowProps) {
  const isLowStock = material.siteQuantity < material.threshold;

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">{material.name}</td>
      <td className="px-6 py-4 whitespace-nowrap">{material.requiredQuantity}</td>
      <td className="px-6 py-4 whitespace-nowrap">{material.siteQuantity}</td>
      <td className="px-6 py-4 whitespace-nowrap">{material.threshold}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            isLowStock
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {isLowStock ? 'Below Threshold' : 'Adequate'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {isLowStock && (
          <button
            onClick={() => onUpdate(material.id, 'increase')}
            className="text-green-600 hover:text-green-900 mr-4"
            title="Replenish Stock"
          >
            <PlusCircle className="h-5 w-5" />
          </button>
        )}
        <button
          onClick={() => onUpdate(material.id, 'decrease')}
          className="text-indigo-600 hover:text-indigo-900 mr-4"
          title="Update Quantity"
        >
          <MinusCircle className="h-5 w-5" />
        </button>
        <button
          onClick={() => onEdit(material)}
          className="text-blue-600 hover:text-blue-900 mr-4"
          title="Edit"
        >
          <Pencil className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(material.id)}
          className="text-red-600 hover:text-red-900"
          title="Delete"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
}