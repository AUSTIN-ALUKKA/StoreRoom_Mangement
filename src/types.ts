export interface Material {
  id: string;
  name: string;
  requiredQuantity: number;
  siteQuantity: number;
  threshold: number;
}

export interface MaterialFormData {
  name: string;
  requiredQuantity: number;
  siteQuantity: number;
  threshold: number;
}