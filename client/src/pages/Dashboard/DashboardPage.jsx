import NavItem from '../../components/NavItem';
import './DashboardPage.css';

export default function DashboardPage() {
  return (
    <div className="dashboard">
      <NavItem
        title="First NavItem"
        imageSrc="path/to/first-image.jpg"
        description="This is the first NavItem."
      />
      <NavItem
        title="Second NavItem"
        imageSrc="path/to/second-image.jpg"
        description="This is the second NavItem."
      />
      <NavItem
        title="Third NavItem"
        imageSrc="path/to/third-image.jpg"
        description="This is the third NavItem."
      />
    </div>
  );
}
