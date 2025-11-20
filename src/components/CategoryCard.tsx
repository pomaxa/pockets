interface CategoryCardProps {
  icon: string;
  title: string;
}

export default function CategoryCard({ icon, title }: CategoryCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0">
        <img src={icon} alt="" className="w-6 h-6" />
      </div>
      <h4 className="font-semibold text-gray-900">{title}</h4>
    </div>
  );
}
