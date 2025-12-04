import openpyxl

# Excelファイルを開く（数式を読み込むためdata_only=False）
wb = openpyxl.load_workbook('いろいろ計算シート簡易版_rev5.xlsx', data_only=False)

# TSparameter関連シートを詳しく分析
sheet = wb['TSparameter関連']

print("=== TSparameter関連シート - 計算式の詳細 ===\n")

# F0計算の部分
print("【F0計算】")
print(f"E11 (F0): {sheet['E11'].value}")
print(f"  数式: {sheet['E11'].value if isinstance(sheet['E11'].value, str) and sheet['E11'].value.startswith('=') else '値のみ'}")

# 入力電圧計算
print("\n【入力電圧計算】")
print(f"G21 (電圧値): {sheet['G21'].value}")

# Vas計算
print("\n【Vas計算】")
print(f"P22 (Vas): {sheet['P22'].value}")

# Qes計算
print("\n【Qes計算】")
print("セルの範囲を確認:")
for row in range(25, 35):
    for col in ['D', 'E', 'F', 'G', 'H', 'I', 'J']:
        cell = sheet[f'{col}{row}']
        if cell.value:
            print(f"{cell.coordinate}: {cell.value}")

print("\n" + "="*80)

# 低音域音圧計算シート
sheet2 = wb['低音域音圧計算']
print("\n=== 低音域音圧計算シート - 計算式の詳細 ===\n")

print("【入力パラメータ】")
for row in range(4, 15):
    e_cell = sheet2[f'E{row}']
    f_cell = sheet2[f'F{row}']
    g_cell = sheet2[f'G{row}']
    if e_cell.value:
        print(f"{e_cell.coordinate}: {e_cell.value} = {f_cell.value} {g_cell.value if g_cell.value else ''}")

print("\n【計算結果の例】")
print(f"D18 (音圧): {sheet2['D18'].value}")
print(f"E18 (dB): {sheet2['E18'].value}")

print("\n" + "="*80)

# ネットワーク定数計算シート
sheet3 = wb['ネットワーク定数計算']
print("\n=== ネットワーク定数計算シート - 計算式の詳細 ===\n")

print("【入力パラメータ】")
for row in range(3, 12):
    b_cell = sheet3[f'B{row}']
    d_cell = sheet3[f'D{row}']
    e_cell = sheet3[f'E{row}']
    if b_cell.value:
        print(f"{b_cell.coordinate}: {b_cell.value} = {d_cell.value} {e_cell.value if e_cell.value else ''}")

print("\n【First order Butterworth】")
print(f"C1: {sheet3['L4'].value} {sheet3['M4'].value}")
print(f"L1: {sheet3['L5'].value} {sheet3['M5'].value}")
