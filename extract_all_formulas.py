import openpyxl

wb = openpyxl.load_workbook('いろいろ計算シート簡易版_rev5.xlsx', data_only=False)
sheet = wb['TSparameter関連']

print("=== 全ての計算式を抽出 ===\n")

# Qms計算
print("【Qms計算】")
print(f"行31 H列: {sheet['H31'].value}")
print(f"行31 I列: {sheet['I31'].value}")

# Qts計算
print("\n【Qts計算】")
for row in range(36, 50):
    for col in ['H', 'I', 'J']:
        cell = sheet[f'{col}{row}']
        if cell.value and (isinstance(cell.value, str) and '=' in str(cell.value)):
            print(f"{cell.coordinate}: {cell.value}")

# 振幅計算
print("\n【振幅計算】")
for row in range(37, 52):
    for col in ['N', 'O', 'P', 'Q', 'R', 'S']:
        cell = sheet[f'{col}{row}']
        if cell.value:
            if isinstance(cell.value, str) and cell.value.startswith('='):
                print(f"{cell.coordinate}: {cell.value}")
            elif row in [37, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51]:
                print(f"{cell.coordinate}: {cell.value}")

# 音圧計算
print("\n【音圧計算】")
for row in range(52, 70):
    for col in ['D', 'E', 'F', 'G', 'H', 'I', 'J']:
        cell = sheet[f'{col}{row}']
        if cell.value:
            if isinstance(cell.value, str) and cell.value.startswith('='):
                print(f"{cell.coordinate}: {cell.value}")
            elif row in [52, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68]:
                print(f"{cell.coordinate}: {cell.value}")

# 薄膜パターン
print("\n【薄膜パターンの抵抗値計算】")
for row in range(70, 80):
    for col in ['D', 'E', 'F', 'G', 'H', 'I']:
        cell = sheet[f'{col}{row}']
        if cell.value:
            print(f"{cell.coordinate}: {cell.value}")

# Xmax計算
print("\n【ドイツのXmax計算】")
for row in range(80, 90):
    for col in ['D', 'E', 'F', 'G', 'H']:
        cell = sheet[f'{col}{row}']
        if cell.value:
            print(f"{cell.coordinate}: {cell.value}")

# 閉管の気中共鳴周波数
print("\n【閉管の気中共鳴周波数計算】")
for row in range(87, 98):
    for col in ['D', 'E', 'F', 'G', 'H']:
        cell = sheet[f'{col}{row}']
        if cell.value:
            print(f"{cell.coordinate}: {cell.value}")
