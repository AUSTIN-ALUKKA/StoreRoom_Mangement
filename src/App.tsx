import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Material, MaterialFormData } from './types';
import { MaterialRow } from './components/MaterialRow';
import { MaterialForm } from './components/MaterialForm';
import { UpdateQuantityModal } from './components/UpdateQuantityModal';
import { ExcelImport } from './components/ExcelImport';

const STORAGE_KEY = 'constructionMaterials';

const emptyFormData: MaterialFormData = {
  name: '',
  requiredQuantity: 0,
  siteQuantity: 0,
  threshold: 0,
};

function App() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [updatingMaterial, setUpdatingMaterial] = useState<{
    material: Material;
    action: 'decrease' | 'increase';
  } | null>(null);

  useEffect(() => {
    const storedMaterials = localStorage.getItem(STORAGE_KEY);
    if (storedMaterials) {
      setMaterials(JSON.parse(storedMaterials));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
  }, [materials]);

  const handleAddMaterial = (data: MaterialFormData) => {
    const newMaterial: Material = {
      ...data,
      id: Date.now().toString(),
    };
    setMaterials([...materials, newMaterial]);
    setShowAddForm(false);
  };

  const handleEditMaterial = (data: MaterialFormData) => {
    if (!editingMaterial) return;
    const updatedMaterials = materials.map((material) =>
      material.id === editingMaterial.id
        ? { ...material, ...data }
        : material
    );
    setMaterials(updatedMaterials);
    setEditingMaterial(null);
  };

  const handleDeleteMaterial = (id: string) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      setMaterials(materials.filter((material) => material.id !== id));
    }
  };

  const handleUpdateQuantity = (quantity: number) => {
    if (!updatingMaterial) return;
    
    const updatedMaterials = materials.map((material) => {
      if (material.id === updatingMaterial.material.id) {
        if (updatingMaterial.action === 'decrease') {
          return {
            ...material,
            siteQuantity: Math.max(0, material.siteQuantity - quantity),
          };
        } else {
          const maxAddition = Math.min(
            quantity,
            material.requiredQuantity
          );
          return {
            ...material,
            siteQuantity: material.siteQuantity + maxAddition,
            requiredQuantity: material.requiredQuantity - maxAddition,
          };
        }
      }
      return material;
    });

    setMaterials(updatedMaterials);
    setUpdatingMaterial(null);
  };

  const handleImportExcel = (importedMaterials: MaterialFormData[]) => {
    const newMaterials = importedMaterials.map((material) => ({
      ...material,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    }));
    setMaterials([...materials, ...newMaterials]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Construction Materials Management
                  </h1>
                  <p className="mt-2 text-sm text-gray-700">
                    Manage your construction site materials inventory
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-4 flex">
                  <ExcelImport onImport={handleImportExcel} />
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Material
                  </button>
                </div>
              </div>
              <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Required Quantity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Site Quantity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Threshold
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {materials.map((material) => (
                          <MaterialRow
                            key={material.id}
                            material={material}
                            onEdit={setEditingMaterial}
                            onDelete={handleDeleteMaterial}
                            onUpdate={(id, action) =>
                              setUpdatingMaterial({
                                material: materials.find((m) => m.id === id)!,
                                action,
                              })
                            }
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddForm && (
        <MaterialForm
          initialData={emptyFormData}
          onSubmit={handleAddMaterial}
          onClose={() => setShowAddForm(false)}
          title="Add New Material"
        />
      )}

      {editingMaterial && (
        <MaterialForm
          initialData={editingMaterial}
          onSubmit={handleEditMaterial}
          onClose={() => setEditingMaterial(null)}
          title="Edit Material"
        />
      )}

      {updatingMaterial && (
        <UpdateQuantityModal
          materialName={updatingMaterial.material.name}
          onSubmit={handleUpdateQuantity}
          onClose={() => setUpdatingMaterial(null)}
          action={updatingMaterial.action}
          maxQuantity={
            updatingMaterial.action === 'increase'
              ? updatingMaterial.material.requiredQuantity
              : undefined
          }
          currentQuantity={
            updatingMaterial.action === 'decrease'
              ? updatingMaterial.material.siteQuantity
              : undefined
          }
        />
      )}
    </div>
  );
}

export default App;