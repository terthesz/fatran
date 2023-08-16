export default function jsonResponse(json: any, status?: number) {
  return new Response(JSON.stringify(json), {
    status: status || json.status || 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}
