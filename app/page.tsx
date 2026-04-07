import { YardProvider } from '@/context/YardContext';
import AppShell from '@/components/AppShell';

export default function Home() {
  return (
    <YardProvider>
      <AppShell />
    </YardProvider>
  );
}
