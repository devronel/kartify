export type CategoryTreeType = {
  id: number;
  name: string;
  isActive: boolean;
  children: CategoryTreeType[];
};

export type Category = {
    id: number;
    name: string;
    isActive: boolean;
}

export type CategoryTreeNodeProps = {
  nodes: CategoryTreeType[];
  level: number,
  onSelected: (category: Category) => void,
  value: Category | null
};