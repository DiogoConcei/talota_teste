# 💖 Página Especial para Talita

Template romântico moderno, responsivo e interativo construído em **HTML5**, **CSS3** e **JavaScript** puro.

---

## 🚀 Como Visualizar a Página
1. Basta dar um duplo clique no arquivo [`index.html`](file:///c:/Users/diogo/Desktop/Talita/index.html) para abrir diretamente em qualquer navegador (Google Chrome, Edge, Safari, Firefox).
2. O site já está pronto e funciona mesmo sem conexão com a internet.

---

## 🎨 O Que Foi Implementado
- **Background Romântico Rico e Vibrante**: Gradiente profundo em tons de carmim, rosa e rubi com iluminação e alto contraste.
- **Chuva de Corações Brilhantes (60 partículas)**: Corações flutuantes em tons de marfim, rosa claro e branco para destacar sobre o fundo.
- **Cartinha Delicada com Coração Tremendo**: Envelope compacto no centro com selo pulsante e contornos sutis.
- **Loading de 10 Segundos**: Barra delicada que desaparece suavemente junto à cartinha ao concluir.
- **Polaroids Autênticas**: Molduras fiéis à foto clássica de Polaroid com janela preta profunda e mini título no queixo inferior.
- **Cartinha Central em Papel Branco**: Folha de carta romântica centralizada entre as fotos com canto dobrado e mensagem de amor.
- **Gerador de Motivos Abaixo da Cartinha**: Caixa interativa posicionada logo abaixo da cartinha para sortear declarações de carinho.
- **Efeito de Toque/Clique**: A cada clique ou toque na tela, um pequeno coração sobe e desaparece suavemente.

---

## ✏️ Como Personalizar

### 1. Como Ajustar o Tempo do Loading
No arquivo [`script.js`](file:///c:/Users/diogo/Desktop/Talita/script.js#L8-L12), altere o valor da propriedade `duracaoLoadingSegundos`:
```javascript
const CONFIG_CASAL = {
  nomeNamorada: "Talita",
  nomeAutor: "Diogo",
  duracaoLoadingSegundos: 10.00 // Altere para quantos segundos quiser!
};
```

### 2. Como Adicionar as Fotos Reais e Títulos nas Polaroids
1. Salve suas fotos reais nesta mesma pasta como `foto1.jpg`, `foto2.jpg`, `foto3.jpg`, etc. O código já carrega essas imagens automaticamente!
2. Para alterar o mini título de qualquer foto, basta editar o texto da tag `<span class="titulo-foto-polaroid">` em [`index.html`](file:///c:/Users/diogo/Desktop/Talita/index.html):
```html
<span class="titulo-foto-polaroid">Nossa viagem especial ✨</span>
```

### 3. Como Editar o Texto da Cartinha de Papel Central
No arquivo [`index.html`](file:///c:/Users/diogo/Desktop/Talita/index.html), localize o bloco `<article class="papel-cartinha-centro">` e edite a mensagem:
```html
<p class="papel-texto">
  Escreva aqui a sua declaração especial para a Talita...
</p>
```

### 4. Como Adicionar ou Alterar os Motivos para Amar
Abra o arquivo [`script.js`](file:///c:/Users/diogo/Desktop/Talita/script.js) e edite a lista `MOTIVOS_PARA_AMAR`:
```javascript
const MOTIVOS_PARA_AMAR = [
  "O seu sorriso ilumina e transforma o meu dia inteiro.",
  "O jeito carinhoso como você fala comigo.",
  "A nossa cumplicidade em cada detalhe.",
  // Adicione quantos motivos quiser entre aspas!
];
```
