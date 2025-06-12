import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { renderToBuffer } from "@react-pdf/renderer";
import { PizzaPDF } from "@/app/lib/pdf/PizzaPDF";

export async function POST(req: Request) {
  const data = await req.json();
  const { email, kaas, vlees, groente } = data;

  const imageMap: Record<string, string> = {
    "Pizza Margherita": "https://res.cloudinary.com/dwbpcbxjk/image/upload/v1749651370/avatars/sttf95uyi12gxofxklq3.jpg",
    "Pizza Pepperoni": "https://res.cloudinary.com/dwbpcbxjk/image/upload/v1749652206/avatars/sdm9b9v3ut0nzqfh5qp0.jpg",
    "Pizza Hawaii": "https://res.cloudinary.com/dwbpcbxjk/image/upload/v1749650530/avatars/ymphdbi8s7wrvsafi3hu.jpg",
    "Pizza Barbecue Chicken": "https://res.cloudinary.com/dwbpcbxjk/image/upload/v1749650227/avatars/dwv7goadobz8rno5oebu.jpg",
    "Pizza Vegetariana": "https://res.cloudinary.com/dwbpcbxjk/image/upload/v1749654299/avatars/mh4udiwjdte0zpsghdah.jpg",
  };

  console.log("SMTP debug:", process.env.SMTP_USER, process.env.SMTP_PASS);

  let pizza = "Pizza Margherita";
  if (vlees === "Ja, pepperoni") pizza = "Pizza Pepperoni";
  else if (groente === "Ananas") pizza = "Pizza Hawaii";
  else if (vlees === "Ja, kip") pizza = "Pizza Barbecue Chicken";
  else if (vlees === "Nee" && (groente !== "Geen" || kaas === "Heel veel"))
    pizza = "Pizza Vegetariana";

  const descriptionMap: Record<string, string> = {
    "Pizza Margherita":
      "Een klassieke pizza met tomaat, mozzarella en basilicum. Eenvoudig, vers en heerlijk.",
    "Pizza Pepperoni":
      "Een pittige favoriet met gesmolten kaas en royale plakjes pepperoni.",
    "Pizza Hawaii":
      "Een tropische mix van ananas en ham – zoet en hartig in balans.",
    "Pizza Barbecue Chicken":
      "Rijke barbecuesaus, sappige kip en een rokerige twist.",
    "Pizza Vegetariana":
      "Volop verse groenten zoals paprika, ui, champignons en olijven.",
  };

  const pdfBuffer = await renderToBuffer(
    <PizzaPDF
      pizzaName={pizza}
      description={descriptionMap[pizza]}
      imageUrl={imageMap[pizza]}
    />
  );

  const message = `
Hallo!

Gebaseerd op je antwoorden, is jouw ideale pizza: ${pizza} 

Zie de bijlage voor meer info. Eet smakelijk!
  `;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Pizza Quiz" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Jouw perfecte pizza: ${pizza}`,
      text: message,
      attachments: [
        {
          filename: `${pizza.replace(/\s/g, "_")}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    console.log(" Sending email to:", email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mail fout:", error);
    return NextResponse.json(
      { error: "Kon e-mail niet versturen" },
      { status: 500 }
    );
  }
}
