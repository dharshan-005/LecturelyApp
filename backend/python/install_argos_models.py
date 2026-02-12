from argostranslate import package

package.update_package_index()
available_packages = package.get_available_packages()

print("Available translation packages:\n")

for p in available_packages:
    print(f"{p.from_code} -> {p.to_code}")