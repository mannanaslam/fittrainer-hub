
import { Container } from "@/components/ui/Container";

interface ComingSoonTabProps {
  tabName: string;
}

export function ComingSoonTab({ tabName }: ComingSoonTabProps) {
  return (
    <Container>
      <div className="glass-card rounded-xl p-6">
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground">
            The {tabName} page is currently in development. Check back soon!
          </p>
        </div>
      </div>
    </Container>
  );
}
