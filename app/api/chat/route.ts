import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Ton backend Next.js récupère la question et l'historique envoyés par le chatbot
    const body = await req.json();

    console.log("Requête reçue dans /api/chat :", body);

    // 2. Récupération des clés de ton RAG Hugging Face dans ton .env
    const ragUrl = process.env.HUGGINGFACE_RAG_URL; 
    const hfToken = process.env.HUGGINGFACE_API_KEY;

    if (!ragUrl) {
      console.error("Variable HUGGINGFACE_RAG_URL manquante");
      return NextResponse.json({ error: "RAG non configuré" }, { status: 500 });
    }

    // Sécurité pour s'assurer que l'URL cible pointe sur le /chat de ton FastAPI HF
    const targetUrl = ragUrl.endsWith('/chat') ? ragUrl : `${ragUrl.replace(/\/$/, '')}/chat`;

    // 3. Ton backend Next.js appelle Hugging Face en lui passant le body
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(hfToken && { 'Authorization': `Bearer ${hfToken}` }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json({ error: "Erreur du RAG distant" }, { status: response.status });
    }

    // 4. Renvoi de la réponse de Hugging Face directement à ton composant de chat
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Erreur passerelle Next.js -> HF:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}