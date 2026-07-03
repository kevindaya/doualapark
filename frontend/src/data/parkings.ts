export interface Parking {
  id: number;
  name: string;
  quartier: string;
  address: string;
  placesUsed: number;
  placesTotal: number;
  rating: number;
  distance: string;
  price: number;
  status: "libre" | "quasi-plein" | "complet";
  color: string;
  image: string;
  lat: number;
  lng: number;
}

export const parkings: Parking[] = [
  { id: 1, name: "Akwa Central Plaza", quartier: "Akwa", address: "Bd de la Liberté, Akwa", placesUsed: 85, placesTotal: 120, rating: 4.5, distance: "0.8 km", price: 500, status: "libre", color: "#2563EB", image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=600&q=80", lat: 4.0435, lng: 9.6966 },
  { id: 2, name: "Bonanjo Finance District", quartier: "Bonanjo", address: "Rue Joss, Bonanjo", placesUsed: 72, placesTotal: 80, rating: 4.0, distance: "1.9 km", price: 400, status: "quasi-plein", color: "#F97316", image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&q=80", lat: 4.0500, lng: 9.6870 },
  { id: 3, name: "Douala Grand Mall", quartier: "Bali", address: "Rue Manguiers, Bali", placesUsed: 150, placesTotal: 150, rating: 4.7, distance: "3.8 km", price: 1000, status: "complet", color: "#EF4444", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", lat: 4.0650, lng: 9.7350 },
  { id: 4, name: "Deido Marché Central", quartier: "Deido", address: "Av. Gén. de Gaulle, Deido", placesUsed: 38, placesTotal: 60, rating: 4.3, distance: "2.1 km", price: 300, status: "libre", color: "#10B981", image: "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?w=600&q=80", lat: 4.0580, lng: 9.7100 },
  { id: 5, name: "Bonapriso Résidentiel", quartier: "Bonapriso", address: "Rue de Triomphe, Bonapriso", placesUsed: 30, placesTotal: 45, rating: 4.8, distance: "4.2 km", price: 600, status: "libre", color: "#3B82F6", image: "https://images.unsplash.com/photo-1611288875785-5e7add96d082?w=600&q=80", lat: 4.0200, lng: 9.6950 },
];

export const statusConfig = {
  libre: {
    label: "Libre",
    bgRaw: "rgba(16,185,129,0.20)",
    borderRaw: "rgba(16,185,129,0.40)",
    colorRaw: "#10B981",
    dotColor: "#10B981",
  },
  "quasi-plein": {
    label: "Quasi-plein",
    bgRaw: "rgba(249,115,22,0.20)",
    borderRaw: "rgba(249,115,22,0.40)",
    colorRaw: "#F97316",
    dotColor: "#F97316",
  },
  complet: {
    label: "Complet",
    bgRaw: "rgba(239,68,68,0.20)",
    borderRaw: "rgba(239,68,68,0.40)",
    colorRaw: "#EF4444",
    dotColor: "#EF4444",
  },
};
