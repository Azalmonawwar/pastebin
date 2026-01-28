export async function GET() {
  try {
    return Response.json({ ok: true }, { status: 200 });
  } catch (e) {
    return Response.json({ ok: false }, { status: 500 });
  }
}
