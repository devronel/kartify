import CategoryList from "@/components/admin/categories/category-list";

export const metadata = {
  title: "Admin - Manage Categories"
};

export default function CategoriesPage(){
  return (
    <>
      <CategoryList />
    </>
  )
}