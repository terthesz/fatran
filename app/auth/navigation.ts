import { usePathname } from 'next/navigation';
import { useUser } from '../firebase/authContext';

export default function navigation() {
  const user = useUser();
  const pathname = usePathname();
}
