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
- ✅ Ver incapacidades de mi área
- ✅ Ver reemplazos de mi área
- ✅ Crear reemplazos para mi área
- ✅ Finalizar y cancelar reemplazos
- ✅ Ver lista de usuarios de mi área
- ✅ Ver dashboard con estadísticas de mi área
- ✅ Generar reportes de mi equipo
- ❌ No puedo ver datos de otras áreas
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
Ver un resumen general del estado de las incapacidades con visualizaciones personalizadas según tu rol.

**¿Qué muestra según el rol?**

#### Colaboradores
- Tarjetas con contadores de sus incapacidades
- Estados: Reportadas, En Revisión, Validadas, Rechazadas, Pagadas

#### Líderes
- Tarjetas con contadores de incapacidades **solo de su área**
- Card adicional: **Reemplazos Asignados** (activos en su área)
- Gráfica de pastel: Distribución de estados de incapacidades de su área
- Gráfica de barras: Reemplazos por colaborador de su área

#### Contabilidad
- Tarjetas con todas las incapacidades del sistema
- Card adicional: **Conciliaciones Generadas**
- Gráfica de pastel: Distribución de costos (Empresa, EPS, ARL)
- Gráfica de barras: Conciliaciones por mes

#### Gestión Humana
- Tarjetas con todas las incapacidades del sistema
- Gráfica de pastel: Distribución de estados
- Gráfica de barras: Incapacidades por tipo (EPS, ARL, Licencias)

**¿Cómo usar?**
1. Al iniciar sesión verás automáticamente tu dashboard personalizado
2. Las gráficas se actualizan en tiempo real
3. Los datos se filtran automáticamente según tu rol y área

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
REPORTADA (Azul) 
   → Recién creada, esperando aprobación de GH

EN_REVISION (Naranja)
   → GH está revisando el documento

VALIDADA (Verde)
   → GH validó y aprobó la incapacidad

RECHAZADA (Rojo)
   → GH rechazó la incapacidad

PAGADA (Morado)
   → Contabilidad confirmó el pago

CONCILIADA (Cyan)
   → Proceso de conciliación completado

ARCHIVADA (Gris)
   → Incapacidad archivada para historial
```

---

### 🔄 Reemplazos

**Importante**: Los líderes solo ven y gestionan reemplazos de su área.

#### Crear Reemplazo (Líderes y GH)

1. Click en "Nuevo Reemplazo"
2. Llenar formulario:
   - **Incapacidad**: Seleccionar de la lista de incapacidades activas disponibles
   - **Colaborador reemplazo**: Seleccionar de disponibles
   - **Fecha inicio**: Primer día del reemplazo
   - **Fecha fin**: Último día del reemplazo
   - **Funciones asignadas**: Descripción de las funciones a realizar
3. Click en "Crear Reemplazo"
4. Se envían notificaciones automáticamente a:
   - Colaborador ausente
   - Colaborador reemplazo

#### Reglas de Disponibilidad

**Incapacidades Disponibles**:
- Solo aparecen incapacidades en estados: Reportada, En Revisión, Validada, Pagada
- NO aparecen incapacidades que ya tienen un reemplazo activo
- Líderes solo ven incapacidades de su área

**Colaboradores Disponibles**:
- Solo colaboradores activos con rol "Colaborador"
- NO aparecen colaboradores que ya están reemplazando a alguien
- NO aparecen colaboradores con incapacidad activa
- NO aparece el colaborador que tiene la incapacidad seleccionada

#### Finalizar Reemplazo

1. En la tabla, click en menú (⋮) del reemplazo activo
2. Seleccionar "Finalizar"
3. Opcionalmente agregar observaciones
4. Click en "Finalizar"
5. El estado cambia a "Finalizado"
6. El colaborador queda disponible para otros reemplazos
7. La incapacidad queda disponible para nuevo reemplazo si aún está activa

#### Cancelar Reemplazo

1. En la tabla, click en menú (⋮) del reemplazo activo
2. Seleccionar "Cancelar"
3. **Obligatorio**: Ingresar motivo de cancelación
4. Click en "Cancelar Reemplazo"
5. El estado cambia a "Cancelado"
6. Se liberan todos los recursos (colaborador e incapacidad)

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

### 📊 Reportes (GH, Conta, Líderes)

#### ¿Qué son los Reportes?

Sistema de generación de reportes en PDF con estadísticas y gráficas personalizadas según tu rol.

#### Tipos de Reporte

**General (Solo GH)**:
- Todas las incapacidades del sistema
- Estadísticas globales
- Gráficas de distribución por estado y tipo

**Financiero (Solo Contabilidad)**:
- Análisis de conciliaciones
- Distribución de pagos (Empresa, EPS, ARL)
- Montos totales y promedios
- Conciliaciones por mes

**Equipo (Solo Líderes)**:
- Incapacidades de su área únicamente
- Estadísticas de su equipo
- Reemplazos asignados en su área
- Gráficas filtradas por área

#### Generar Reporte

1. Ir al módulo "Reportes" en el menú lateral
2. **Filtros** (opcionales):
   - Fecha Inicio: Primer día del período
   - Fecha Fin: Último día del período
3. **Tipo de Reporte**: Se selecciona automáticamente según tu rol
   - GH ve: "General"
   - Contabilidad ve: "Financiero"
   - Líder ve: "Equipo"
4. Click en "Generar PDF"
5. Esperar procesamiento (5-15 segundos)
6. El PDF se descarga automáticamente

#### Contenido del Reporte

**Encabezado**:
- Nombre de la empresa (configurable)
- Tipo de reporte
- Fecha de generación
- Usuario que genera
- Área (para líderes)
- Período (si se aplicaron filtros)

**Cards Estadísticas**:
- Total de incapacidades
- Validadas
- En Revisión
- Rechazadas
- Reemplazos Asignados (solo líderes)

**Gráficas**:
- Distribución por Estado (Pie chart)
- Incapacidades por Tipo o Costos (Bar chart)

**Pie de página**:
- Información del sistema
- Datos del usuario

---

### ⚙️ Configuración (Solo GH)

#### Configurar Nombre de la Empresa

1. Ir al módulo "Configuración" en el menú lateral
2. Ver el formulario de configuración
3. Ingresar el nombre de la empresa en el campo
4. Click en "Guardar Configuración"
5. El nombre se usará en todos los reportes PDF generados
6. Se guarda en el navegador (persiste entre sesiones)

**Nota**: Esta configuración solo afecta los reportes PDF, no el nombre del sistema.

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

#### Visualización Filtrada por Área

**Importante**: Como líder, solo verás datos de tu área asignada.

**¿Qué veo de mi área?**
- Incapacidades de colaboradores de mi área
- Reemplazos relacionados con mi área
- Usuarios de mi área
- Estadísticas y gráficas filtradas

**¿Qué NO veo?**
- Incapacidades de otras áreas
- Reemplazos de otras áreas
- Datos globales de la empresa

#### Dashboard de Líder

1. **Cards personalizadas**:
   - Total incapacidades de mi área
   - Reportadas, En Revisión, Validadas, Rechazadas, Pagadas
   - **Reemplazos Asignados** (activos en mi área)

2. **Gráficas específicas**:
   - Distribución de estados de mi área
   - Reemplazos por colaborador de mi área

#### Gestionar Reemplazos de mi Área

1. **Identificar ausencia**
   - Un colaborador de mi área tiene incapacidad

2. **Crear reemplazo**
   - Reemplazos → Nuevo Reemplazo
   - Solo aparecen incapacidades de mi área
   - Solo aparecen colaboradores disponibles:
     * Sin incapacidad activa
     * No están reemplazando a nadie
     * Son colaboradores activos
   - Definir fechas y funciones
   - Crear

3. **Finalizar reemplazo**
   - Cuando el colaborador regrese
   - Menú → Finalizar
   - Agregar observaciones (opcional)
   - Confirmar

4. **Cancelar reemplazo**
   - Si hay cambios o errores
   - Menú → Cancelar
   - **Obligatorio**: Ingresar motivo
   - Confirmar

#### Generar Reportes de mi Equipo

1. **Ir a Reportes**
2. **Filtrar por fechas** (opcional)
3. **Generar PDF**
   - El reporte muestra solo datos de tu área
   - Incluye card de Reemplazos Asignados
   - Gráficas filtradas por tu área

#### Buenas Prácticas

- Revisar dashboard diariamente
- Crear reemplazos apenas se aprueben incapacidades
- Finalizar reemplazos cuando el colaborador regrese
- No cancelar sin motivo válido
- Usar observaciones para documentar

---

### 📕 Guía para Gestión Humana

#### Dashboard de GH

1. **Cards completas**:
   - Total de incapacidades del sistema (todas las áreas)
   - Estados: Reportadas, En Revisión, Validadas, Rechazadas, Pagadas

2. **Gráficas generales**:
   - Distribución de estados de todo el sistema
   - Incapacidades por tipo (EPS, ARL, Licencias)

#### Flujo Completo de Incapacidad

1. **Recibir notificación** de nueva incapacidad

2. **Revisar documento**
   - Abrir detalle de incapacidad
   - Analizar con OCR (recomendado)
   - Verificar datos

3. **Cambiar a En Revisión**
   - Menú → Cambiar Estado → EN_REVISION
   - Mientras verificas la información

4. **Validar o Rechazar**
   - Si todo está correcto → VALIDADA
   - Si hay problemas → RECHAZADA (agregar observación)

5. **Seguimiento**
   - Esperar confirmación de Contabilidad
   - Estado final: PAGADA → CONCILIADA

#### Completar Datos de Usuario

Cuando un nuevo usuario se registra:

1. **Recibes notificación**
2. **Ir a Usuarios**
3. **Menú → Editar Información**
4. **Completar**:
   - Salario base
   - IBC  
   - Área (Marketing, Operaciones, Finanzas, etc.)
   - Cargo
5. **Guardar**

**Importante**: El área asignada determina qué líder puede ver al usuario

#### Generar Reportes Generales

1. **Ir a Reportes**
2. **Tipo**: Automáticamente "General"
3. **Filtrar por fechas** (opcional)
4. **Generar PDF**
   - Reporte completo del sistema
   - Todas las áreas
   - Estadísticas globales
   - Gráficas generales

#### Configurar Sistema

1. **Ir a Configuración**
2. **Nombre de la Empresa**:
   - Ingresar nombre oficial
   - Aparecerá en todos los reportes PDF
3. **Guardar Configuración**

#### Gestión de Usuarios

**Ver todos los usuarios**:
- Acceso completo a la lista de usuarios
- Puede editar cualquier usuario
- Puede cambiar roles

**Cambiar rol de usuario**:
1. Menú → Cambiar Rol
2. Seleccionar nuevo rol
3. El usuario debe cerrar sesión para ver cambios

**Asignar áreas**:
- Asignar área a líderes (determina qué ven)
- Asignar área a colaboradores (determina qué líder los gestiona)

---

### 📗 Guía para Contabilidad

#### Dashboard de Contabilidad

1. **Cards personalizadas**:
   - Total de incapacidades del sistema
   - Estados: Reportadas, En Revisión, Validadas, Rechazadas, Pagadas
   - **Conciliaciones Generadas**

2. **Gráficas financieras**:
   - Distribución de costos (Empresa 67%, EPS, ARL)
   - Conciliaciones por mes

#### Verificar Pagos

1. **Ver incapacidades VALIDADAS**
   - Dashboard → Filtrar por VALIDADA

2. **Confirmar cuando la EPS/ARL realice el pago**

3. **Marcar como PAGADA**
   - Menú → Cambiar Estado → PAGADA
   - Esto genera automáticamente la conciliación

#### Gestionar Conciliaciones

1. **Acceder a Conciliaciones**
   - Menú lateral → Conciliaciones

2. **Revisar conciliaciones generadas**
   - Ver desglose financiero de cada incapacidad
   - Revisar cálculos de días empresa vs EPS
   - Consultar estadísticas de totales conciliados

3. **Estadísticas disponibles**:
   - Total conciliado
   - Promedio por conciliación
   - Distribución por tipo (EPS, ARL)

#### Generar Reportes Financieros

1. **Ir a Reportes**
2. **Tipo**: Automáticamente "Financiero"
3. **Filtrar por fechas** (opcional)
4. **Generar PDF**
   - Análisis completo de conciliaciones
   - Distribución de pagos
   - Gráficas financieras
   - Totales y promedios

---

## Tips y Mejores Prácticas

### 🎯 Generales

1. **Cerrar sesión** cuando termines
2. **Verificar notificaciones** regularmente (se actualizan cada 10 segundos)
3. **Adjuntar documentos** claros y legibles
4. **Completar todos los campos** obligatorios

### 📊 Para Líderes

1. **Revisar dashboard** al inicio del día
2. **Filtrado automático**: Recuerda que solo ves datos de tu área
3. **Crear reemplazos** apenas se aprueben incapacidades
4. **Finalizar reemplazos** cuando el colaborador regrese
5. **Documentar con observaciones** todos los cambios
6. **Generar reportes** mensualmente para seguimiento

### 💼 Para Gestión Humana

1. **Asignar áreas correctamente** a usuarios y líderes
2. **Usar OCR** para verificar documentos rápidamente
3. **Completar datos de usuarios** recién registrados
4. **Generar reportes** para análisis y toma de decisiones
5. **Configurar nombre de empresa** antes de generar reportes

### 💰 Para Contabilidad

1. **Revisar dashboard financiero** regularmente
2. **Verificar conciliaciones** automáticas generadas
3. **Marcar como pagado** solo cuando se confirme el pago
4. **Generar reportes financieros** para auditoría
5. **Revisar distribución de costos** en las gráficas

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

### No veo datos en el dashboard (Líderes)
- Verifica que tengas un área asignada
- Contacta a GH para que te asigne un área
- Verifica que haya incapacidades en tu área

### No aparecen colaboradores disponibles para reemplazo
- Verifica que no tengan incapacidad activa
- Verifica que no estén reemplazando a alguien
- Contacta a GH si el problema persiste

### No aparece mi incapacidad en la lista de reemplazos
- Verifica que no tenga un reemplazo activo
- Si ya tiene reemplazo, no aparecerá hasta que se finalice
- Verifica el estado de la incapacidad

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

### No puedo generar reportes
- Verifica tu rol (GH, Conta, Líderes)
- Verifica que haya datos en el período seleccionado
- Para líderes: verifica que tengas área asignada

### Las gráficas no muestran datos
- Verifica que existan datos en tu área (Líderes)
- Verifica el período de fechas seleccionado
- Refresca la página

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
- **ARL**: Administradora de Riesgos Laborales
- **GH**: Gestión Humana
- **Dashboard**: Panel principal de inicio con estadísticas
- **Área**: Departamento o división de la empresa (Marketing, Operaciones, Finanzas, etc.)
- **Reemplazo Activo**: Reemplazo que está en curso actualmente
- **Filtrado por Área**: Visualización de datos únicamente del área asignada (Líderes)
- **Conciliación**: Proceso de cálculo y registro del pago de una incapacidad

---

*Última actualización: Noviembre 2025*
