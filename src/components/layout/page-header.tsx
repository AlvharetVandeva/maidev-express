type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-extrabold tracking-normal text-slate-900 md:text-3xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-1 max-w-2xl text-sm text-slate-500 md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
