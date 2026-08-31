export type CategoryTree = {
  id: number;
  name: string;
  isActive: boolean;
  children: CategoryTree[];
};

export type Category = {
    id: number;
    name: string;
    isActive: boolean;
}

export type CategoryFormValues = {
    id?: number,
    name: string,
    parentId: number | null,
    description: string,
    isActive: boolean
}

export type CategoryTreeNodeProps = {
  nodes: CategoryTree[];
  level: number,
  onSelected: (category: Category) => void,
  value: Category | null
};

