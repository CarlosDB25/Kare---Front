# Manual de Usuario - KARE

## Índice
1. [Introducción](#introducción)
2. [Acceso al Sistema](#acceso-al-sistema)
3. [Roles y Permisos](#roles-y-permisos)
4. [Módulos del Sistema](#módulos-del-sistema)
5. [Guías por Rol](#guías-por-rol)

---

## Introducción

KARE es un sistema integral para la gestión de incapacidades médicas que permite:
- Registrar y hacer seguimiento de incapacidades
- Gestionar reemplazos de personal
- Controlar conciliaciones financieras
- Recibir notificaciones en tiempo real

---

## Acceso al Sistema

### Registro de Nuevo Usuario

1. Abrir la aplicación en el navegador
2. Click en "Regístrate aquí" en la página de login
3. Completar el formulario:
   - Nombre completo
   - Número de documento
   - Correo electrónico
   - Contraseña (mínimo 6 caracteres)
   - Confirmar contraseña
4. Click en "Crear Cuenta"
5. **Importante**: El registro crea automáticamente un usuario con rol **Colaborador**
6. Gestión Humana recibirá una notificación para completar tus datos

### Iniciar Sesión

1. Ingresar email y contraseña
2. Click en "Iniciar Sesión"
3. Serás redirigido al Dashboard

### Recuperar Contraseña
*Funcionalidad pendiente de implementación*

---

## Roles y Permisos

### 🟢 Colaborador
**¿Qué puedo hacer?**
- ✅ Crear mis incapacidades
- ✅ Ver mis incapacidades
- ✅ Recibir notificaciones
- ❌ No puedo aprobar incapacidades
- ❌ No puedo crear reemplazos

### 🟠 Líder
**¿Qué puedo hacer?**
- ✅ Todo lo del Colaborador
- ✅ Ver lista de reemplazos
- ✅ Crear reemplazos
- ✅ Extender días de reemplazo
- ✅ Ver lista de usuarios
- ❌ No puedo aprobar incapacidades

### 🔵 Gestión Humana (GH)
**¿Qué puedo hacer?**
- ✅ Todo lo anterior
- ✅ Aprobar/rechazar incapacidades
- ✅ Analizar documentos con OCR
- ✅ Radicar incapacidades
- ✅ Editar información de usuarios
- ✅ Ver todas las incapacidades

### 🟢 Contabilidad
**¿Qué puedo hacer?**
- ✅ Ver incapacidades
- ✅ Marcar como pagadas
- ✅ Gestionar conciliaciones
- ✅ Ver reemplazos
- ❌ No puedo crear incapacidades

---

## Módulos del Sistema

### 📊 Dashboard

**¿Para qué sirve?**
Ver un resumen general del estado de las incapacidades

**¿Qué muestra?**
- Tarjetas con contadores por estado (Pendiente, Aprobada, Radicada, Pagada)
- Filtros por período de tiempo
- Accesos rápidos a cada categoría

**¿Cómo usar?**
1. Seleccionar período en el menú superior (Último mes, 3 meses, año)
2. Ver los números en cada tarjeta
3. Click en una tarjeta para ver el detalle

---

### 📄 Incapacidades

#### Crear Nueva Incapacidad (Solo Colaboradores)

1. Click en botón "Nueva Incapacidad" (esquina superior derecha)
2. Llenar formulario:
   - **Tipo**: Enfermedad General o Accidente Laboral
   - **Fecha de inicio**: Primer día de incapacidad
   - **Fecha de fin**: Último día de incapacidad  
   - **Diagnóstico**: Descripción médica
   - **Documento**: Subir PDF o imagen (JPG, PNG)
3. Click en "Crear"
4. Esperar aprobación de GH

#### Ver Detalles de Incapacidad

1. En la tabla, click en el ícono del ojo (👁️)
2. Ver información completa:
   - Datos del colaborador
   - Fechas y duración
   - Estado actual
   - Documento adjunto
   - Historial de estados
3. Click en "Ver documento" para descargar
4. Click en "Cerrar" para salir

#### Editar Incapacidad

1. Click en el ícono de editar (✏️)
2. Solo se pueden editar:
   - Tipo
   - Fechas
   - Diagnóstico
3. **No se puede** cambiar el estado (solo GH)
4. Click en "Guardar"

#### Estados de Incapacidad

```
PENDIENTE (Amarillo) 
   → Recién creada, esperando aprobación de GH

APROBADA (Verde claro)
   → GH aprobó, esperando radicación

RADICADA (Azul)
   → GH radicó ante la EPS

PAGADA (Verde)
   → Contabilidad confirmó el pago

RECHAZADA (Rojo)
   → GH rechazó la incapacidad
```

---

### 🔄 Reemplazos

#### Crear Reemplazo (Líderes y GH)

1. Click en "Nuevo Reemplazo"
2. Llenar formulario:
   - **Colaborador ausente**: Seleccionar de la lista
   - **Colaborador reemplazo**: Seleccionar de disponibles
   - **Fecha inicio**: Primer día del reemplazo
   - **Fecha fin**: Último día del reemplazo
3. Click en "Crear Reemplazo"
4. Se envían notificaciones automáticamente a:
   - Colaborador ausente
   - Colaborador reemplazo

#### Extender Reemplazo

1. En la tabla, click en menú (⋮)
2. Seleccionar "Extender"
3. Ingresar días adicionales
4. Click en "Extender"
5. Se notifica automáticamente al incapacitado

---

### 🔔 Notificaciones

#### Ver Notificaciones

1. Click en el ícono de campana (🔔) en la barra superior
2. El número indica notificaciones no leídas
3. Ver lista de notificaciones:
   - **Info** (azul): Información general
   - **Success** (verde): Acciones exitosas
   - **Warning** (amarillo): Advertencias
   - **Error** (rojo): Errores

#### Marcar como Leída

1. Click en cualquier notificación
2. Se marca automáticamente como leída
3. Si tiene link, navega al módulo correspondiente

#### Navegar desde Notificación

- Notificaciones de incapacidades → Click lleva a la incapacidad
- Notificaciones de reemplazos → Información en el mensaje
- Notificaciones de usuarios → Revisar en gestión de usuarios

---

### 👥 Usuarios (GH, Conta, Líderes)

#### Ver Lista de Usuarios

1. Menú lateral → "Usuarios" (ícono de personas)
2. Ver tabla con:
   - Nombre
   - Email
   - Rol
   - Área
   - Cargo

#### Editar Información de Usuario (Solo GH)

1. Click en menú (⋮) al lado del usuario
2. Seleccionar "Editar Información"
3. Modificar campos:
   - **Salario Base**: Sueldo mensual
   - **IBC**: Ingreso Base de Cotización
   - **Área**: Departamento (seleccionar de lista)
   - **Cargo**: Posición en la empresa
4. Click en "Guardar"
5. Los datos se actualizan para validaciones de OCR

#### Cambiar Rol de Usuario (Solo GH)

1. Click en menú (⋮)
2. Seleccionar "Cambiar Rol"
3. Seleccionar nuevo rol
4. Click en "Guardar"
5. El usuario debe cerrar sesión para ver cambios

---

### 💰 Conciliaciones (Conta y GH)

#### Ver Conciliaciones

Las conciliaciones se generan automáticamente desde el módulo de incapacidades cuando una incapacidad está en estado PAGADA.

#### Información de Conciliación

1. Ver tabla de conciliaciones
2. Click en "Ver detalle" para revisar:
   - **Colaborador**: Quien tuvo la incapacidad
   - **Tipo**: EPS o ARL
   - **Días**: Total de días de incapacidad
   - **Desglose**:
     * Días empresa (1-2): 66.67% del salario
     * Días EPS (3+): 66.67% del IBC
   - **Total**: Monto total calculado

#### Estadísticas

- Total de conciliaciones generadas
- Valor total conciliado
- Promedio por conciliación
- Promedio de días

---

### 🤖 Análisis OCR (Solo GH)

#### ¿Qué es el OCR?

Sistema de extracción automática de datos de documentos médicos que compara la información con el perfil del colaborador.

#### Usar OCR

1. Ir a Incapacidades
2. Click en detalles de una incapacidad
3. Click en botón "Analizar Documento con OCR"
4. Cargar el documento médico (PDF o imagen)
5. Click en "Analizar"
6. Esperar procesamiento (10-30 segundos)
7. Ver resultados:
   - **Nombre extraído** vs Nombre del colaborador
   - **Documento extraído** vs Documento del colaborador
   - **Similitud**: Porcentaje de coincidencia
   - ✅ Verde: Todo correcto
   - ⚠️ Amarillo: Revisar diferencias
   - ❌ Rojo: No coincide
8. Tomar acción según resultado

**Importante**: 
- Solo funciona con imágenes (JPG, PNG) o PDFs con texto seleccionable
- PDFs escaneados deben convertirse a imagen primero

---

## Guías por Rol

### 📘 Guía para Colaboradores

#### Mi primer día en KARE

1. **Registro**
   - Registrarte en la página de inicio
   - Esperar que GH complete tus datos

2. **Reportar Incapacidad**
   - Dashboard → Incapacidades
   - Click "Nueva Incapacidad"
   - Llenar todos los campos
   - Adjuntar documento médico
   - Enviar

3. **Seguimiento**
   - Ver estado en la tabla
   - Recibir notificaciones de cambios
   - Esperar aprobación de GH

#### Preguntas Frecuentes

**¿Qué hago si me equivoqué en una incapacidad?**
- Si está en estado PENDIENTE, puedes editarla
- Si ya fue aprobada, contacta a GH

**¿Cuánto tarda la aprobación?**
- Depende de GH, generalmente 1-2 días

**¿Puedo ver incapacidades de otros?**
- No, solo ves las tuyas

---

### 📙 Guía para Líderes

#### Gestionar Reemplazos

1. **Identificar ausencia**
   - Un colaborador tiene incapacidad aprobada

2. **Crear reemplazo**
   - Reemplazos → Nuevo Reemplazo
   - Seleccionar ausente y reemplazo
   - Definir fechas
   - Crear

3. **Extender si es necesario**
   - Si la incapacidad se extiende
   - Menu → Extender
   - Agregar días extras

4. **Notificar**
   - El sistema notifica automáticamente
   - Verificar que ambos recibieron la notificación

---

### 📕 Guía para Gestión Humana

#### Flujo Completo de Incapacidad

1. **Recibir notificación** de nueva incapacidad

2. **Revisar documento**
   - Abrir detalle de incapacidad
   - Analizar con OCR (recomendado)
   - Verificar datos

3. **Aprobar o Rechazar**
   - Menu → Cambiar Estado
   - Si apruebas → APROBADA
   - Si rechazas → RECHAZADA (agregar observación)

4. **Radicar**
   - Cuando envíes a EPS
   - Menu → Cambiar Estado → RADICADA

5. **Seguimiento**
   - Esperar confirmación de Contabilidad
   - Estado final: PAGADA

#### Completar Datos de Usuario

Cuando un nuevo usuario se registra:

1. **Recibes notificación**
2. **Ir a Usuarios**
3. **Menu → Editar Información**
4. **Completar**:
   - Salario base
   - IBC  
   - Área
   - Cargo
5. **Guardar**

---

### 📗 Guía para Contabilidad

#### Verificar Pagos

1. **Ver incapacidades RADICADAS**
   - Dashboard → Filtrar por RADICADA

2. **Confirmar cuando la EPS/ARL realice el pago**

3. **Marcar como PAGADA**
   - Menu → Cambiar Estado → PAGADA

4. **Gestionar conciliaciones**
   - Ver el desglose financiero de cada incapacidad
   - Revisar cálculos de días empresa vs EPS
   - Consultar estadísticas de totales conciliados

---

## Tips y Mejores Prácticas

### 🎯 Generales

1. **Cerrar sesión** cuando termines
2. **Verificar notificaciones** regularmente
3. **Adjuntar documentos** claros y legibles
4. **Completar todos los campos** obligatorios

### 📄 Documentos

1. **Formato recomendado**: PDF o JPG
2. **Tamaño**: Menos de 5MB
3. **Calidad**: Legible, sin sombras
4. **OCR**: Mejor con documentos digitales que escaneados

### 🔐 Seguridad

1. No compartir contraseñas
2. Cerrar sesión en computadoras compartidas
3. Reportar accesos no autorizados

### ⚡ Performance

1. Si la aplicación va lenta, refresca la página (F5)
2. Cierra pestañas que no uses
3. Usa navegadores modernos (Chrome, Firefox, Edge)

---

## Solución de Problemas

### No puedo iniciar sesión
- Verifica email y contraseña
- Verifica que tengas conexión a internet
- Intenta refrescar la página

### No veo el botón "Nueva Incapacidad"
- Verifica tu rol (solo Colaboradores)
- Cierra sesión y vuelve a entrar

### El OCR no funciona
- Verifica que el archivo sea JPG, PNG o PDF
- El PDF debe tener texto seleccionable
- PDFs escaneados: convertir a imagen

### No me llegan notificaciones
- Verifica el ícono de campana
- Refresca la página
- El sistema actualiza cada 10 segundos

### Mis datos no aparecen en el perfil
- Cierra sesión
- Vuelve a iniciar sesión
- Si persiste, contacta a GH

---

## Contacto y Soporte

**Problemas técnicos**: Contacta al administrador del sistema
**Dudas sobre incapacidades**: Gestión Humana
**Temas de pago**: Contabilidad

---

## Glosario

- **OCR**: Optical Character Recognition (Reconocimiento Óptico de Caracteres)
- **IBC**: Ingreso Base de Cotización
- **EPS**: Entidad Promotora de Salud
- **GH**: Gestión Humana
- **JWT**: Token de autenticación
- **Dashboard**: Panel principal de inicio

---

*Última actualización: Noviembre 2024*
