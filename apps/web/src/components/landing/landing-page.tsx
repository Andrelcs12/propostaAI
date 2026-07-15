import { ArrowRight, Check, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { landingConfig } from "@/config/landing";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            {landingConfig.nav.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/cadastro">Cadastrar</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="container-page grid gap-12 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-24">
        <div className="max-w-2xl">
          <span className="rounded-full border bg-card px-3 py-1 text-sm text-muted-foreground">
            Template oficial para novos produtos
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-normal md:text-6xl">
            {landingConfig.hero.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {landingConfig.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/cadastro">
                {landingConfig.hero.primaryCta}
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#funcionalidades">{landingConfig.hero.secondaryCta}</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="rounded-md border bg-background p-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="text-sm text-muted-foreground">Painel</p>
                <p className="font-medium">Produto pronto para validar</p>
              </div>
              <LayoutDashboard className="size-5 text-primary" />
            </div>
            <div className="grid gap-3 py-4">
              {["Auth conectado", "Usuario persistido", "Stripe estrutural"].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-md border bg-card px-3 py-3 text-sm">
                  <span>{item}</span>
                  <Check className="size-4 text-primary" />
                </div>
              ))}
            </div>
            <div className="rounded-md bg-secondary p-4">
              <p className="text-sm font-medium">Base enxuta</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Sem workspace, equipes, assinaturas ou regras de produto nesta versao.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="beneficios" className="border-y bg-secondary/40 py-16">
        <div className="container-page grid gap-4 md:grid-cols-3">
          {landingConfig.benefits.map((benefit) => (
            <Card key={benefit.title}>
              <CardHeader>
                <CardTitle className="text-xl">{benefit.title}</CardTitle>
                <CardDescription>{benefit.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section id="funcionalidades" className="container-page py-16">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-normal">Funcionalidades iniciais</h2>
          <p className="mt-3 text-muted-foreground">
            O necessario para iniciar e validar um MicroSaaS sem carregar arquitetura desnecessaria.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {landingConfig.features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="size-5 text-primary" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-secondary/40 py-16">
        <div className="container-page grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-start">
          <div>
            <h2 className="text-3xl font-semibold tracking-normal">Como funciona</h2>
            <p className="mt-3 text-muted-foreground">
              Um fluxo direto para sair do clone inicial ate a primeira validacao.
            </p>
          </div>
          <div className="grid gap-3">
            {landingConfig.steps.map((step, index) => (
              <div key={step} className="flex gap-4 rounded-lg border bg-card p-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="preco" className="container-page py-16">
        <Card className="mx-auto max-w-xl">
          <CardHeader>
            <CardTitle>{landingConfig.pricing.name}</CardTitle>
            <CardDescription>{landingConfig.pricing.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{landingConfig.pricing.price}</p>
            <Separator className="my-6" />
            <ul className="grid gap-3 text-sm">
              {landingConfig.pricing.items.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="size-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section id="faq" className="border-y bg-secondary/40 py-16">
        <div className="container-page max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-normal">Perguntas frequentes</h2>
          <div className="mt-8 grid gap-4">
            {landingConfig.faqs.map((faq) => (
              <Card key={faq.question}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                  <CardDescription>{faq.answer}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 text-center">
        <h2 className="text-3xl font-semibold tracking-normal">Pronto para criar o proximo produto?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Use este template como ponto de partida e adicione regras de produto somente quando forem validadas.
        </p>
        <Button asChild className="mt-8" size="lg">
          <Link href="/cadastro">Comecar agora</Link>
        </Button>
      </section>

      <footer className="border-t py-8">
        <div className="container-page flex flex-col justify-between gap-3 text-sm text-muted-foreground md:flex-row">
          <p>Novely SaaS Template</p>
          <p>Base reutilizavel para MicroSaaS da Novely.</p>
        </div>
      </footer>
    </main>
  );
}
