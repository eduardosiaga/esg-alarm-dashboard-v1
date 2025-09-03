# HeroUI Card Component Documentation

## Importación
```tsx
import {Card, CardHeader, CardBody, CardFooter} from "@heroui/react";
```

## Estructura Básica
```tsx
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Actions</CardFooter>
</Card>
```

## Propiedades del Card

### Visuales
- `shadow`: none | sm | md | lg (default: "md")
- `radius`: none | sm | md | lg (default: "lg") 
- `fullWidth`: boolean (default: false)
- `isBlurred`: boolean - blur del fondo completo
- `isFooterBlurred`: boolean - blur solo del footer

### Interactividad
- `isHoverable`: boolean - cambio de fondo al hover
- `isPressable`: boolean - permite presionar la tarjeta
- `onPress`: (e: PressEvent) => void - handler de clic
- `isDisabled`: boolean - deshabilita eventos

### Animaciones
- `disableAnimation`: boolean
- `disableRipple`: boolean - solo cuando isPressable=true

### Personalización
- `classNames`: Permite clases CSS personalizadas para slots:
  - `base`: contenedor principal
  - `header`: sección del header
  - `body`: sección del body  
  - `footer`: sección del footer

## Ejemplos de Uso

### Card Básica
```tsx
<Card className="bg-background/60 shadow-small">
  <CardBody className="p-6">
    <h2>Título</h2>
    <p>Contenido</p>
  </CardBody>
</Card>
```

### Card con Header y Footer
```tsx
<Card>
  <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
    <h4>Header Title</h4>
  </CardHeader>
  <CardBody className="overflow-visible py-2">
    <p>Content goes here</p>
  </CardBody>
  <CardFooter className="pt-2">
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Card Interactiva
```tsx
<Card isPressable onPress={() => console.log("Card pressed!")}>
  <CardBody>
    <p>Clickable Content</p>
  </CardBody>
</Card>
```

### Card con Divider
```tsx
<Card>
  <CardBody>Content</CardBody>
  <Divider />
  <CardFooter>Actions</CardFooter>
</Card>
```

## Layout y Grid

### Grid de Cards
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {cards.map((card, index) => (
    <Card key={index} className="bg-background/60 shadow-small">
      <CardBody className="p-4">
        {/* contenido */}
      </CardBody>
    </Card>
  ))}
</div>
```

## Mejores Prácticas

1. **Estructura**: Siempre usar CardHeader, CardBody, CardFooter para organización
2. **Spacing**: Usar padding consistente (p-4, p-6)
3. **Sombras**: shadow-small para cards secundarias, shadow-md para principales
4. **Background**: bg-background/60 para transparencia sutil
5. **Radius**: Mantener radius="lg" por defecto para consistencia