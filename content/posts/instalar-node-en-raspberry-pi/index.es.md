---
title: 'Instalar node en Raspberry Pi'
slug: instalar-node-en-raspberry-pi
date: 2017-06-30T00:00:00+00:00
lastmod: 2017-06-30T00:00:00+00:00
author: 'Joel Jacquez'
authorLink: ''
featuredImage: 'featured-image.jpg'

tags: [NodeJS, Raspberry, raspbian, linux]
---

Hola, en este post explico como instalar correctamente **NodeJS** correctamente en un raspberry pi, con sistema operativo de la familia debian(raspbian), lo que debemos hacer es seguir estos sencillos pasos:

<!--more-->

## Paso 1: Identificar versión procesador

Lo primero que debemos saber es, la versión de procesador que tenemos nuestra raspberry pi, para instalar el paquete correcto.

```Bash
$ uname -a
```

En mi caso me dio el siguiente resultado

```Bash
Linux raspberrypi 4.9.28-v7+ #998 SMP Fri Jun 30 16:55:39 BST 2017 armv7l GNU/Linux
```

En mi caso me sale que tengo la version **ARMv7** por lo cual esa es la version que tengo que descargar.

## Paso 2: Descargar node

Ahora buscamos en la página oficial de [NodeJS](https://nodejs.org/en/download/current/) y copiamos el link para proceder con la descarga con el siguiente comando:

```Bash Descargar node
wget https://nodejs.org/dist/v8.1.3/node-v8.1.3-linux-armv7l.tar.xz
```

## Paso 3: Descomprimir ejecutable

Ahora descomprimimos el archivo y accedemos a la carpeta resultante

```Bash
$ tar -xvf node-v8.1.3-linux-armv7l.tar.xz
$ cd node-v8.1.3-linux-armv7l
```

## Paso 4: Copiar archivos

Ahora solo queda copiar todo lo que está en la carpeta que descomprimimos al directorio `/usr/local` y eso lo hacemos así:

```Bash
$ sudo cp -r * /usr/local
```

Si todo va bien hasta aquí ya tenemos instalado NodeJS en nuestro Raspberry Pi y si tecleamos `node -v` nos debe arrojar esto `v8.1.2`

Eso es todo amigos, si les gusto o les sirvio no duden en compartir
