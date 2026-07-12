import os
import shutil

src_dir = "./frontend"
dest_dir = "./backend/src/main/resources/static"

# Create destination directory if it doesn't exist
os.makedirs(dest_dir, exist_ok=True)

# Copy index.html
shutil.copy(os.path.join(src_dir, "index.html"), os.path.join(dest_dir, "index.html"))

# Copy assets folder
if os.path.exists(os.path.join(dest_dir, "assets")):
    shutil.rmtree(os.path.join(dest_dir, "assets"))
shutil.copytree(os.path.join(src_dir, "assets"), os.path.join(dest_dir, "assets"))

# Copy src folder
if os.path.exists(os.path.join(dest_dir, "src")):
    shutil.rmtree(os.path.join(dest_dir, "src"))
shutil.copytree(os.path.join(src_dir, "src"), os.path.join(dest_dir, "src"))

print("Frontend files successfully merged into Spring Boot static resources!")
