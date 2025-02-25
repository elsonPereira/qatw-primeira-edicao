import { test, expect } from '@playwright/test';

import { obterCodigo2FA } from '../support/db';

import { LoginPage } from '../pages/LoginPage';

test('Nao deve logar quando o codigo de autenticacao é invalido', async ({ page }) => {

  const loginPage = new LoginPage(page)
  
  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }

  await loginPage.acessaPagina()
  await loginPage.informaCpf(usuario.cpf)
  await loginPage.informaSenha(usuario.senha)  
  await loginPage.informe2FA('123456')
  
  await expect(page.locator('span')).toContainText('Código inválido. Por favor, tente novamente.')
});

test('Deve acessar a conta do usuário', async ({ page }) => {

  const loginPage = new LoginPage(page)
  
  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }

  await loginPage.acessaPagina()
  await loginPage.informaCpf(usuario.cpf)
  await loginPage.informaSenha(usuario.senha)

  await page.waitForTimeout(3000)
  const codigo = await obterCodigo2FA()
  
  await loginPage.informe2FA(codigo)
  
  await page.waitForTimeout(2000)

  expect(await loginPage.obterSaldo()).toHaveText('R$ 5.000,00')
});