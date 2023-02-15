import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/common/color-scheme-toggle/color-scheme-toggle';

export default function HomePage() {
  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
    </>
  );
}
