# 🎨 Guia de Imagens e GIFs dos Avatares - AvatarES

## 📁 Estrutura de Pastas

O sistema está preparado para exibir imagens e GIFs dos seus avatares professores. Aqui está como configurar:

```
public/
├── avatars/
│   ├── prof-carlos.png          # Matemática
│   ├── sarah.png                # Inglês
│   ├── dom-pedro.png            # História
│   ├── profa-mariana.png        # Português
│   ├── prof-bruno.png           # Ciências
│   ├── profa-sofia.png          # Geografia
│   ├── prof-lucas.png           # Educação Física
│   ├── mestra-carolina.png      # Arte
│   ├── maestro-antonio.png      # Música
│   ├── socrates.png             # Filosofia
│   ├── monge-tenzin.png         # Religião/Ética
│   ├── dev-ana.png              # Informática
│   └── senorita-isabella.png    # Espanhol
```

## 🎬 Formatos Suportados

O sistema suporta qualquer formato de imagem web:
- **PNG** (recomendado para transparência) ✅
- **JPG/JPEG** (mais leve) ✅
- **GIF** (animado) ✅
- **WebP** (melhor compressão) ✅
- **SVG** (vetorial) ✅

## 📝 Passo a Passo: Como Adicionar Imagens

### 1️⃣ **Crie ou Prepare suas Imagens**

**Especificações recomendadas:**
- **Tamanho:** 256x256 pixels (mínimo 200x200)
- **Formato:** PNG com transparência (fundo transparente)
- **Aspecto:** Quadrado (1:1)
- **Peso:** 50-200 KB por arquivo
- **Estilo:** Avatar, ilustração, foto ou GIF

**Exemplos de avatares que funcionam bem:**
- Desenhos/ilustrações dos professores
- Avatares 3D
- Fotos com fundo transparente
- GIFs animados (melhor ainda!)

### 2️⃣ **Crie a Pasta `avatars`**

Se não existir, crie a pasta:
```
c:\Users\leosc\OneDrive\Área de Trabalho\VoiceSync\avatares-educacionais\public\avatars\
```

### 3️⃣ **Coloque as Imagens**

Copie suas imagens dos avatares para a pasta `public/avatars/` com os NOMES EXATOS:

| Arquivo | Professor | Matéria |
|---------|-----------|---------|
| `prof-carlos.png` | Professor Carlos | Matemática |
| `sarah.png` | Sarah | Inglês |
| `dom-pedro.png` | Dom Pedro II | História |
| `profa-mariana.png` | Profa. Mariana | Português |
| `prof-bruno.png` | Prof. Bruno | Ciências |
| `profa-sofia.png` | Profa. Sofia | Geografia |
| `prof-lucas.png` | Prof. Lucas | Educação Física |
| `mestra-carolina.png` | Mestra Carolina | Arte |
| `maestro-antonio.png` | Maestro Antônio | Música |
| `socrates.png` | Sócrates | Filosofia |
| `monge-tenzin.png` | Monge Tenzin | Religião/Ética |
| `dev-ana.png` | Dev Ana | Informática |
| `senorita-isabella.png` | Señorita Isabella | Espanhol |

### 4️⃣ **Atualize o arquivo de avatares (se necessário)**

O sistema já está configurado! As imagens aparecem automaticamente nos cards das matérias:

**Arquivo:** `src/lib/avatars.ts`

Cada avatar já tem o campo `imageUrl` configurado:

```typescript
{
    id: 'prof-matematica',
    name: 'Professor Carlos',
    // ... outras propriedades
    imageUrl: '/avatars/prof-carlos.png',  // ← Campo já existe!
    // ...
}
```

Se quiser mudar o nome da imagem de um avatar, edite o arquivo:

```typescript
// Exemplo: Se você quer usar prof-carlos.gif em vez de prof-carlos.png
imageUrl: '/avatars/prof-carlos.gif',
```

### 5️⃣ **Teste no Navegador**

1. Coloque as imagens na pasta
2. Abra `http://localhost:3000/dashboard` no navegador
3. As imagens aparecerem em cada card de matéria ao passar o mouse
4. Se não aparecerem, verifique:
   - Nome do arquivo está correto?
   - Pasta é `public/avatars/`?
   - Extensão está correta (`.png`, `.gif`, etc)?

## 🎬 Criando GIFs dos seus Avatares

### Opção 1: Usar Ferramentas Online (Mais Fácil)

**Sites para criar GIFs:**
1. [ezgif.com](https://ezgif.com) - Melhor opção!
   - Upload múltiplas imagens
   - Cria GIF animado
   - Redimensiona automáticamente
   - Exporta PNG ou GIF

2. [gifmaker.me](https://gifmaker.me) - Simples e rápido

3. [giphy.com/create](https://giphy.com/create) - Profissional

### Opção 2: Usar Soft ware Instalado

**Windows:**
- Adobe Photoshop (profissional)
- GIMP (gratuito)
- Paint.NET (simples)

**Todos os SOs:**
- FFmpeg (command line, muito bom)

### Opção 3: AI para Gerar Avatares

**Geradores com IA:**
1. **Stable Diffusion** - Gera imagens de avatares
2. **Midjourney** - Resultados muito bons
3. **DALL-E** - OpenAI
4. **Leonardo.ai** - Gratuito

**Prompts que funcionam bem:**
```
"Anime art, professor de matemática, confiante, sorridente, 
fundo transparente, estilo avatarativo"

"Cartoon illustration of english tutor, friendly smile, 
transparent background, educational style"

"3D avatar of a philosopher, wise expression, robes, 
transparent background"
```

## 📊 Onde as Imagens Aparecem

### 1. **Dashboard - Cards das Matérias**
- Quando você passa o mouse sobre um card de matéria
- Aparece em um círculo de 96x96 pixels
- Com border branca e sombra

### 2. **Página de Conversa**
- Podemos adicionar também aqui (próxima fase)

### 3. **Cards de Avatares**
- Na página de avatares também
- Mesmo tamanho e estilo

## 🔄 Atualizando Imagens

Se quiser trocar uma imagem:

1. **Deletar a anterior** da pasta `public/avatars/`
2. **Copiar a nova** com o MESMO nome
3. **Limpar cache do navegador** (Ctrl+Shift+Delete)
4. **Recarregar a página** (Ctrl+R)

## ⚡ Dicas Importantes

✅ **O QUE FAZER:**
- Use extensão `.png` para melhor qualidade
- Use GIFs para algo mais dinâmico
- Mantenha o tamanho ao redor de 256x256px
- Use fundo transparente quando possível
- Teste no navegador antes de usar

❌ **O QUE EVITAR:**
- Não use nomes diferentes do especificado
- Não coloque em pasta errada
- Não use arquivos muito pesados (> 500KB)
- Não use extensões incomuns (.bmp, .ico)

## 📸 Exemplo de Estrutura Final

Quando você terminar, a pasta ficará assim:

```
public/
└── avatars/
    ├── prof-carlos.png (256x256, 150KB)
    ├── sarah.png (256x256, 140KB)
    ├── dom-pedro.png (256x256, 160KB)
    ├── profa-mariana.png (256x256, 145KB)
    ├── prof-bruno.png (256x256, 155KB)
    ├── profa-sofia.gif (256x256, 300KB - animado!)
    ├── prof-lucas.png (256x256, 150KB)
    ├── mestra-carolina.png (256x256, 148KB)
    ├── maestro-antonio.png (256x256, 152KB)
    ├── socrates.png (256x256, 158KB)
    ├── monge-tenzin.png (256x256, 144KB)
    ├── dev-ana.gif (256x256, 280KB - animado!)
    └── senorita-isabella.png (256x256, 146KB)
```

## 🚀 Próximos Passos

1. ✅ Prepare suas imagens
2. ✅ Crie a pasta `public/avatars/`
3. ✅ Adicione as imagens com nomes corretos
4. ✅ Teste no navegador
5. ✅ Aproveite! 🎉

## 💡 Troubleshooting

**P: As imagens não aparecem**
R: Verifique se:
- O nome do arquivo está 100% correto
- A pasta é `public/avatars/` (não em outra pasta)
- Reiniciou o servidor (`npm run dev`)

**P: As imagens aparecem cortadas**
R: Use imagens quadradas (256x256 ou similar)

**P: Os GIFs não animam**
R: Seus GIFs podem estar corrompidos. Reconverta usando ezgif.com

**P: Qual formato é melhor?**
R: PNG para qualidade, GIF para animação, WebP para menor tamanho

## 📞 Suporte

Qualquer dúvida sobre as imagens, pergunte! O sistema está 100% preparado para:
- ✅ PNG, JPG, GIF, WebP, SVG
- ✅ Imagens estáticas ou animadas
- ✅ Redimensionamento automático
- ✅ Fallback gracioso se imagem não carregar

---

**Desenvolvido com ❤️ para AvatarES - Sistema de Educação com IA**
