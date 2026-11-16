import Screen from '../components/Screen';
import MemberCards from '../components/MemberCards';
export default function Photographers({ navigation }) {
  return <Screen title="Photographers" subtitle="Meet the people behind the lens.">
    <MemberCards onSelect={id => navigation.navigate('PhotographerProfile', { id })} />
  </Screen>;
}
