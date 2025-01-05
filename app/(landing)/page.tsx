import ClientComponent from "./_components/client-component";

export default async function Home() {
	return (
		<div className="h-full flex flex-col items-center w-full gap-y-4">
			<ClientComponent />
		</div>
	);
}
