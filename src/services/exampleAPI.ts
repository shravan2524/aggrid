const exampleBaseAPI = 'https://example/api/here';

export async function fetchSomeExampleData(pageNumber: number) {
  const response = await fetch(`${exampleBaseAPI}?page=${pageNumber}`);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}
