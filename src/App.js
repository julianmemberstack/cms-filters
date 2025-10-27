import './App.css';
import './globals.css';
import { Badge } from './Badge';
import { CMSFilterSearch } from './CMSFilterSearch';
import { useState } from 'react';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';

// Mock pagination demo component
function PaginationDemo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 15; // Mock 15 pages
  const filteredResults = 142; // Mock results count

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 7;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="w-full">
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search items..."
        className="mb-4"
      />

      <div className="text-muted-foreground mb-4">
        Showing {filteredResults} results
      </div>

      {/* Mock results */}
      <div className="space-y-2 mb-4 p-4 border rounded-md">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <div key={item} className="p-2 bg-background border rounded text-sm">
            Mock Item {(currentPage - 1) * 10 + item} - This would be a CMS list item
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex gap-2 items-center justify-center mt-4 flex-wrap">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>

          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2"
                >
                  ...
                </span>
              );
            }

            return (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className="min-w-10"
              >
                {page}
              </Button>
            );
          })}

          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-6">CMS Filters - Component Testing</h1>

          {/* Badge Examples */}
          <section className="mb-8 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Badge Component</h2>
            <p className="text-muted-foreground mb-4">Testing shadcn/ui Badge with Tailwind v3</p>
            <div className="flex gap-4 items-center">
              <Badge text="Light Variant" variant="Light" />
              <Badge text="Dark Variant" variant="Dark" />
            </div>
          </section>

          {/* CMS Filter Search Example */}
          <section className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">CMS Filter Search Component</h2>
            <p className="text-muted-foreground mb-4">
              Testing shadcn/ui Input & Button components with Tailwind v3
            </p>
            <div className="bg-muted/50 p-4 rounded-md">
              <p className="text-sm text-muted-foreground mb-4">
                Note: This component requires Finsweet CMS attributes in a live Webflow site.
                Below is a mock preview showing the pagination UI.
              </p>
              <PaginationDemo />
            </div>
          </section>

          {/* Shadcn UI Test */}
          <section className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Additional Shadcn Components</h2>
            <p className="text-muted-foreground mb-4">
              Your project is now set up with shadcn/ui and Tailwind v3!
            </p>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge text="Default" variant="Dark" />
                <Badge text="Secondary" variant="Light" />
              </div>
              <p className="text-sm">
                All shadcn/ui components are available. Install more with:
                <code className="block mt-2 p-2 bg-muted rounded">
                  npx shadcn@latest add [component-name]
                </code>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
