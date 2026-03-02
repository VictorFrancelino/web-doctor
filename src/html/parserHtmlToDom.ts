import { Parser } from "htmlparser2";

type AstItems = {
  tag: string;
  atributos: AtributosItems[];
};

type AtributosItems = {
  nome: string;
  valor: string;
};

async function analyzeHtml(path: string): Promise<AstItems[]> {
  const code = await Bun.file(path).text();

  const astHtmlItems: AstItems[] = [];
  const pilha: AstItems[] = [];

  const parser = new Parser({
    onopentag(tag, atributos) {
      const atributosItems: AtributosItems[] = Object.entries(atributos).map(
        ([nome, valor]) => ({ nome, valor })
      );

      const item: AstItems = { tag, atributos: atributosItems };
      pilha.push(item);
      astHtmlItems.push(item);
    },

    onclosetag() {
      pilha.pop();
    },

    onerror(erro) {
      console.error("Erro ao analisar HTML:", erro);
    },
  });

  parser.write(code);
  parser.end();

  return astHtmlItems;
}

export default analyzeHtml;