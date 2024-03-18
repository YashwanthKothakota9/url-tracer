export default function Content() {
  const handleButtonClick = () => {
    alert('From React within Content Script');
  };
  return (
    <div
      className="be-bg-green-300 be-fixed be-right-0 be-
bottom-0"
      onClick={handleButtonClick}
    ></div>
  );
}
