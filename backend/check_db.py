from app.core.supabase_client import supabase
try:
    # Try to get one row to see columns
    result = supabase.table("reports").select("*").limit(1).execute()
    print("Table columns found:")
    if result.data:
        print(result.data[0].keys())
    else:
        print("Table is empty, but exists.")
except Exception as e:
    print(f"Error accessing table: {e}")
