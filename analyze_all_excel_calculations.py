import openpyxl

# Excelファイルを開く
wb = openpyxl.load_workbook('いろいろ計算シート簡易版_rev5.xlsx', data_only=False)

# TSparameter関連シートを詳しく分析
sheet = wb['TSparameter関連']

print("=== TSparameter関連シート - 全ての計算セクション ===\n")

# 全ての行を確認して、計算セクションを特定
print("【全セクションの確認】")
for row in range(1, 100):
    d_cell = sheet[f'D{row}']
    if d_cell.value and isinstance(d_cell.value, str):
        # セクションタイトルっぽいものを抽出
        if '計算' in str(d_cell.value) or '抵抗' in str(d_cell.value) or 'Xmax' in str(d_cell.value):
            print(f"行{row}: {d_cell.value}")
            # その周辺の内容も表示
            for offset in range(1, 10):
                next_row = row + offset
                if next_row > 98:
                    break
                e_cell = sheet[f'E{next_row}']
                f_cell = sheet[f'F{next_row}']
                g_cell = sheet[f'G{next_row}']
                if e_cell.value:
                    print(f"  行{next_row}: {e_cell.value} = {f_cell.value} {g_cell.value if g_cell.value else ''}")
            print()

print("\n" + "="*80 + "\n")

# Qms計算の詳細
print("【Qms計算の詳細】")
for row in range(25, 45):
    m_cell = sheet[f'M{row}']
    n_cell = sheet[f'N{row}']
    o_cell = sheet[f'O{row}']
    p_cell = sheet[f'P{row}']
    if m_cell.value or n_cell.value:
        print(f"行{row}: {m_cell.value} | {n_cell.value} | {o_cell.value} | {p_cell.value}")

print("\n" + "="*80 + "\n")

# Qts計算の詳細
print("【Qts計算の詳細】")
for row in range(32, 50):
    d_cell = sheet[f'D{row}']
    e_cell = sheet[f'E{row}']
    f_cell = sheet[f'F{row}']
    g_cell = sheet[f'G{row}']
    h_cell = sheet[f'H{row}']
    if d_cell.value and 'Qts' in str(d_cell.value):
        print(f"行{row}: {d_cell.value} | {e_cell.value} | {f_cell.value} | {g_cell.value} | {h_cell.value}")
        for offset in range(1, 5):
            next_row = row + offset
            d2 = sheet[f'D{next_row}']
            e2 = sheet[f'E{next_row}']
            f2 = sheet[f'F{next_row}']
            if e2.value:
                print(f"  行{next_row}: {d2.value} | {e2.value} | {f2.value}")

print("\n" + "="*80 + "\n")

# 振幅計算の詳細
print("【振幅計算の詳細】")
for row in range(35, 60):
    d_cell = sheet[f'D{row}']
    if d_cell.value and '振幅' in str(d_cell.value):
        print(f"行{row}: {d_cell.value}")
        for offset in range(1, 15):
            next_row = row + offset
            e_cell = sheet[f'E{next_row}']
            f_cell = sheet[f'F{next_row}']
            g_cell = sheet[f'G{next_row}']
            if e_cell.value:
                print(f"  行{next_row}: {e_cell.value} = {f_cell.value} {g_cell.value if g_cell.value else ''}")

print("\n" + "="*80 + "\n")

# 薄膜パターン関連
print("【薄膜パターン関連】")
for row in range(50, 98):
    d_cell = sheet[f'D{row}']
    if d_cell.value and ('薄膜' in str(d_cell.value) or '抵抗' in str(d_cell.value)):
        print(f"行{row}: {d_cell.value}")
        for offset in range(1, 10):
            next_row = row + offset
            if next_row > 98:
                break
            e_cell = sheet[f'E{next_row}']
            f_cell = sheet[f'F{next_row}']
            g_cell = sheet[f'G{next_row}']
            if e_cell.value:
                print(f"  行{next_row}: {e_cell.value} = {f_cell.value} {g_cell.value if g_cell.value else ''}")
